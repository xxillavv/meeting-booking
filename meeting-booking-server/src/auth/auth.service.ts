import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto, RegisterDto } from './dto/auth.dto.js';
import { SALT_ROUNDS } from './auth.constants.js';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService,
    private readonly prisma: PrismaService
  ) { }

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: { name: dto.name.trim(), email, passwordHash },
    });

    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email });

    return { accessToken };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email });

    return { accessToken };
  }
}
