import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { BookingsController } from './bookings.controller.js';
import { RoomsModule } from '../rooms/rooms.module.js';

@Module({
  imports: [RoomsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
