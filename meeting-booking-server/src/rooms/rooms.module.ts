import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service.js';
import { RoomsController } from './rooms.controller.js';
import { RoomAccessService } from './room-access.service.js';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, RoomAccessService],
  exports: [RoomAccessService],
})
export class RoomsModule {}
