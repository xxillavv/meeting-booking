import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RoomRole } from '../generated/prisma/enums.js';
import { RoomAccessService } from '../rooms/room-access.service.js';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto.js';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roomAccess: RoomAccessService
  ) { }

  async findAllForRoom(roomId: string, userId: string) {
    await this.roomAccess.assertRoomRole(roomId, userId)

    const bookings = await this.prisma.booking.findMany({
      where: {
        roomId,
        endTime: { gt: new Date() }
      },
      include: {
        createdBy: {
          select: { id: true, name: true }
        },
        participants: {
          select: {
            user: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { joinedAt: 'asc' }
        }
      },
      orderBy: { startTime: 'asc' }
    })

    return bookings.map((booking) => ({
      ...booking,
      participants: booking.participants.map(({ user }) => user),
      isParticipant: booking.participants.some(({ user }) => user.id === userId)
    }))
  }

  async create(userId: string, dto: CreateBookingDto) {
    await this.roomAccess.assertRoomRole(dto.roomId, userId, RoomRole.ADMIN)

    this.assertValidTimeRange(dto.startTime, dto.endTime)
    this.assertNotInPast(dto.startTime)
    await this.assertNoConflict(dto.roomId, dto.startTime, dto.endTime)

    const booking = await this.prisma.booking.create({
      data: {
        roomId: dto.roomId,
        createdById: userId,
        description: dto.description?.trim(),
        startTime: dto.startTime,
        endTime: dto.endTime,
        participants: {
          create: { userId }
        }
      },
      include: {
        createdBy: {
          select: { id: true, name: true }
        },
        participants: {
          select: {
            user: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { joinedAt: 'asc' }
        }
      }
    })

    return {
      ...booking,
      participants: booking.participants.map(({ user }) => user),
      isParticipant: booking.participants.some(({ user }) => user.id === userId)
    }
  }

  async update(bookingId: string, userId: string, dto: UpdateBookingDto) {
    const booking = await this.findBookingOrThrow(bookingId)
    await this.roomAccess.assertRoomRole(booking.roomId, userId, RoomRole.ADMIN)

    const startTime = dto.startTime ?? booking.startTime
    const endTime = dto.endTime ?? booking.endTime

    if (dto.startTime || dto.endTime) {
      this.assertValidTimeRange(startTime, endTime)
      if (dto.startTime) {
        this.assertNotInPast(dto.startTime)
      }
      await this.assertNoConflict(booking.roomId, startTime, endTime, bookingId)
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        startTime,
        endTime,
        description: dto.description?.trim()
      },
      include: {
        createdBy: {
          select: { id: true, name: true }
        },
        participants: {
          select: {
            user: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { joinedAt: 'asc' }
        }
      }
    })

    return {
      ...updatedBooking,
      participants: updatedBooking.participants.map(({ user }) => user),
      isParticipant: updatedBooking.participants.some(({ user }) => user.id === userId)
    }
  }

  async remove(bookingId: string, userId: string) {
    const booking = await this.findBookingOrThrow(bookingId)
    await this.roomAccess.assertRoomRole(booking.roomId, userId, RoomRole.ADMIN)

    await this.prisma.booking.delete({
      where: { id: bookingId }
    })
  }

  async join(bookingId: string, userId: string) {
    const booking = await this.findBookingOrThrow(bookingId)
    await this.roomAccess.assertRoomRole(booking.roomId, userId)

    if (booking.endTime <= new Date()) {
      throw new BadRequestException('Booking has already ended')
    }

    const existingParticipant = await this.prisma.bookingParticipant.findUnique({
      where: {
        bookingId_userId: { bookingId, userId }
      }
    })
    if (existingParticipant) {
      throw new ConflictException('You have already joined this booking')
    }

    await this.prisma.bookingParticipant.create({
      data: { bookingId, userId }
    })

    const joinedBooking = await this.prisma.booking.findUniqueOrThrow({
      where: { id: bookingId },
      include: {
        createdBy: {
          select: { id: true, name: true }
        },
        participants: {
          select: {
            user: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { joinedAt: 'asc' }
        }
      }
    })

    return {
      ...joinedBooking,
      participants: joinedBooking.participants.map(({ user }) => user),
      isParticipant: joinedBooking.participants.some(({ user }) => user.id === userId)
    }
  }

  async leave(bookingId: string, userId: string) {
    const booking = await this.findBookingOrThrow(bookingId)
    await this.roomAccess.assertRoomRole(booking.roomId, userId)

    const participant = await this.prisma.bookingParticipant.findUnique({
      where: {
        bookingId_userId: { bookingId, userId }
      }
    })
    if (!participant) {
      throw new NotFoundException('You are not a participant of this booking')
    }

    await this.prisma.bookingParticipant.delete({
      where: {
        bookingId_userId: { bookingId, userId }
      }
    })
  }

  private async findBookingOrThrow(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId }
    })

    if (!booking) {
      throw new NotFoundException('Booking not found')
    }

    return booking
  }

  private assertValidTimeRange(startTime: Date, endTime: Date) {
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time')
    }
  }

  private assertNotInPast(startTime: Date) {
    if (startTime <= new Date()) {
      throw new BadRequestException('Start time must be in the future')
    }
  }

  private async assertNoConflict(roomId: string, startTime: Date, endTime: Date, excludeBookingId?: string) {
    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        roomId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        startTime: { lt: endTime },
        endTime: { gt: startTime }
      }
    })

    if (conflictingBooking) {
      throw new ConflictException(
        `Room is already booked from ${conflictingBooking.startTime.toISOString()} to ${conflictingBooking.endTime.toISOString()}`
      )
    }
  }
}
