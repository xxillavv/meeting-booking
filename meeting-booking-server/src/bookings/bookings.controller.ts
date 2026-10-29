import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { AuthGuard, type RequestWithUser } from '../auth/guards/auth.guard.js';
import { CreateBookingDto, GetBookingsQueryDto, UpdateBookingDto } from './dto/booking.dto.js';

@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  getBookings(@Req() request: RequestWithUser, @Query() query: GetBookingsQueryDto) {
    return this.bookingsService.findAllForRoom(query.roomId, request.user.sub)
  }

  @Post()
  createBooking(@Req() request: RequestWithUser, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(request.user.sub, dto)
  }

  @Patch(':id')
  updateBooking(
    @Req() request: RequestWithUser,
    @Param('id', ParseUUIDPipe) bookingId: string,
    @Body() dto: UpdateBookingDto
  ) {
    return this.bookingsService.update(bookingId, request.user.sub, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBooking(@Req() request: RequestWithUser, @Param('id', ParseUUIDPipe) bookingId: string): Promise<void> {
    await this.bookingsService.remove(bookingId, request.user.sub)
  }

  @Post(':id/participants')
  joinBooking(@Req() request: RequestWithUser, @Param('id', ParseUUIDPipe) bookingId: string) {
    return this.bookingsService.join(bookingId, request.user.sub)
  }

  @Delete(':id/participants')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leaveBooking(@Req() request: RequestWithUser, @Param('id', ParseUUIDPipe) bookingId: string): Promise<void> {
    await this.bookingsService.leave(bookingId, request.user.sub)
  }
}
