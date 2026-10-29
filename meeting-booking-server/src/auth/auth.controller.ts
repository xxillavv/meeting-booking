import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto } from './dto/auth.dto.js';
import { ACCESS_TOKEN_COOKIE, CLEAR_COOKIE_OPTIONS, COOKIE_OPTIONS } from './auth.constants.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post('register')
  async registerUser(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { accessToken } = await this.authService.register(dto);

    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, COOKIE_OPTIONS);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginUser(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { accessToken } = await this.authService.login(dto);

    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, COOKIE_OPTIONS);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logoutUser(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie(ACCESS_TOKEN_COOKIE, CLEAR_COOKIE_OPTIONS);
  }
}
