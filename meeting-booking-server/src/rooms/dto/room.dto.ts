import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { RoomRole } from '../../generated/prisma/enums.js';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) { }

export class AddMemberDto {
  @IsEmail()
  email: string;

  @IsEnum(RoomRole)
  role: RoomRole;
}

export class UpdateMemberRoleDto {
  @IsEnum(RoomRole)
  role: RoomRole;
}
