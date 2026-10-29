import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service.js';
import { AuthGuard, type RequestWithUser } from '../auth/guards/auth.guard.js';
import { AddMemberDto, CreateRoomDto, UpdateMemberRoleDto, UpdateRoomDto } from './dto/room.dto.js';

@Controller('rooms')
@UseGuards(AuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  createRoom(@Req() request: RequestWithUser, @Body() dto: CreateRoomDto) {
    return this.roomsService.create(request.user.sub, dto)
  }

  @Get()
  getRooms(@Req() request: RequestWithUser) {
    return this.roomsService.findAllForUser(request.user.sub)
  }

  @Get(':id')
  getRoom(@Req() request: RequestWithUser, @Param('id', ParseUUIDPipe) roomId: string) {
    return this.roomsService.findOne(roomId, request.user.sub)
  }

  @Get(':id/bookings')
  

  @Patch(':id')
  updateRoom(
    @Req() request: RequestWithUser,
    @Param('id', ParseUUIDPipe) roomId: string,
    @Body() dto: UpdateRoomDto
  ) {
    return this.roomsService.update(roomId, request.user.sub, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRoom(@Req() request: RequestWithUser, @Param('id', ParseUUIDPipe) roomId: string): Promise<void> {
    await this.roomsService.remove(roomId, request.user.sub)
  }

  @Get(':id/members')
  getMembers(@Req() request: RequestWithUser, @Param('id', ParseUUIDPipe) roomId: string) {
    return this.roomsService.getMembers(roomId, request.user.sub)
  }

  @Post(':id/members')
  addMember(
    @Req() request: RequestWithUser,
    @Param('id', ParseUUIDPipe) roomId: string,
    @Body() dto: AddMemberDto
  ) {
    return this.roomsService.addMember(roomId, request.user.sub, dto)
  }

  @Patch(':id/members/:userId')
  updateMemberRole(
    @Req() request: RequestWithUser,
    @Param('id', ParseUUIDPipe) roomId: string,
    @Param('userId', ParseUUIDPipe) memberUserId: string,
    @Body() dto: UpdateMemberRoleDto
  ) {
    return this.roomsService.updateMemberRole(roomId, request.user.sub, memberUserId, dto)
  }

  @Delete(':id/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMember(
    @Req() request: RequestWithUser,
    @Param('id', ParseUUIDPipe) roomId: string,
    @Param('userId', ParseUUIDPipe) memberUserId: string
  ): Promise<void> {
    await this.roomsService.removeMember(roomId, request.user.sub, memberUserId)
  }
}
