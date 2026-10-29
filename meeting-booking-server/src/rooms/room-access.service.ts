import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RoomRole } from '../generated/prisma/enums.js';

@Injectable()
export class RoomAccessService {
  constructor(private readonly prisma: PrismaService) { }

  async assertRoomRole(roomId: string, userId: string, requiredRole?: RoomRole) {
    const membership = await this.prisma.roomMember.findUnique({
      where: {
        roomId_userId: { roomId, userId }
      }
    })

    if (!membership) {
      throw new NotFoundException('Room not found')
    }

    if (requiredRole && membership.role !== requiredRole) {
      throw new ForbiddenException('You do not have permission to perform this action')
    }

    return membership
  }
}
