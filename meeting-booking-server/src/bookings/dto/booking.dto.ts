import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  roomId: string;

  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @Type(() => Date)
  @IsDate()
  endTime: Date;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class UpdateBookingDto extends PartialType(OmitType(CreateBookingDto, ['roomId'] as const)) { }

export class GetBookingsQueryDto {
  @IsUUID()
  roomId: string;
}
