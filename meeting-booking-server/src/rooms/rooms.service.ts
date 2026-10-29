import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RoomRole } from '../generated/prisma/enums.js';
import { RoomAccessService } from './room-access.service.js';
import { AddMemberDto, CreateRoomDto, UpdateMemberRoleDto, UpdateRoomDto } from './dto/room.dto.js';

const memberUserSelect = {
  id: true,
  name: true,
  email: true
} as const

@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roomAccess: RoomAccessService
  ) { }

  async create(userId: string, dto: CreateRoomDto) {
    const room = await this.prisma.room.create({
      data: {
        name: dto.name.trim(),
        description: dto.description?.trim(),
        members: {
          create: { userId, role: RoomRole.ADMIN }
        }
      }
    })

    return { ...room, role: RoomRole.ADMIN }
  }

  async findAllForUser(userId: string) {
    const memberships = await this.prisma.roomMember.findMany({
      where: { userId },
      include: {
        room: {
          include: {
            _count: { select: { members: true } }
          }
        }
      },
      orderBy: { room: { createdAt: 'desc' } }
    })

    return memberships.map(({ room, role }) => ({ ...room, role }))
  }

  async findOne(roomId: string, userId: string) {
    const { role } = await this.roomAccess.assertRoomRole(roomId, userId)

    const room = await this.prisma.room.findUniqueOrThrow({
      where: { id: roomId },
      include: {
        _count: { select: { members: true } }
      }
    })

    return { ...room, role }
  }

  async update(roomId: string, userId: string, dto: UpdateRoomDto) {
    await this.roomAccess.assertRoomRole(roomId, userId, RoomRole.ADMIN)

    return this.prisma.room.update({
      where: { id: roomId },
      data: {
        name: dto.name?.trim(),
        description: dto.description?.trim()
      }
    })
  }

  async remove(roomId: string, userId: string) {
    await this.roomAccess.assertRoomRole(roomId, userId, RoomRole.ADMIN)

    await this.prisma.room.delete({
      where: { id: roomId }
    })
  }

  async getMembers(roomId: string, userId: string) {
    await this.roomAccess.assertRoomRole(roomId, userId)

    return this.prisma.roomMember.findMany({
      where: { roomId },
      select: {
        role: true,
        createdAt: true,
        user: { select: memberUserSelect }
      },
      orderBy: { createdAt: 'asc' }
    })
  }

  async addMember(roomId: string, userId: string, dto: AddMemberDto) {
    await this.roomAccess.assertRoomRole(roomId, userId, RoomRole.ADMIN)

    const email = dto.email.trim().toLowerCase()

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true }
    })
    if (!user) {
      throw new NotFoundException('User with this email not found')
    }

    const existingMember = await this.prisma.roomMember.findUnique({
      where: {
        roomId_userId: { roomId, userId: user.id }
      }
    })
    if (existingMember) {
      throw new ConflictException('User is already a member of this room')
    }

    return this.prisma.roomMember.create({
      data: { roomId, userId: user.id, role: dto.role },
      select: {
        role: true,
        createdAt: true,
        user: { select: memberUserSelect }
      }
    })
  }

  async updateMemberRole(roomId: string, userId: string, memberUserId: string, dto: UpdateMemberRoleDto) {
    await this.roomAccess.assertRoomRole(roomId, userId, RoomRole.ADMIN)

    const member = await this.findMemberOrThrow(roomId, memberUserId)

    if (member.role === RoomRole.ADMIN && dto.role !== RoomRole.ADMIN) {
      await this.assertNotLastAdmin(roomId)
    }

    return this.prisma.roomMember.update({
      where: {
        roomId_userId: { roomId, userId: memberUserId }
      },
      data: { role: dto.role },
      select: {
        role: true,
        createdAt: true,
        user: { select: memberUserSelect }
      }
    })
  }

  async removeMember(roomId: string, userId: string, memberUserId: string) {
    await this.roomAccess.assertRoomRole(roomId, userId, RoomRole.ADMIN)

    const member = await this.findMemberOrThrow(roomId, memberUserId)

    if (member.role === RoomRole.ADMIN) {
      await this.assertNotLastAdmin(roomId)
    }

    await this.prisma.roomMember.delete({
      where: {
        roomId_userId: { roomId, userId: memberUserId }
      }
    })
  }

  private async findMemberOrThrow(roomId: string, userId: string) {
    const member = await this.prisma.roomMember.findUnique({
      where: {
        roomId_userId: { roomId, userId }
      }
    })

    if (!member) {
      throw new NotFoundException('Member not found')
    }

    return member
  }

  private async assertNotLastAdmin(roomId: string) {
    const adminsCount = await this.prisma.roomMember.count({
      where: { roomId, role: RoomRole.ADMIN }
    })

    if (adminsCount <= 1) {
      throw new BadRequestException('Room must have at least one admin')
    }
  }
}
