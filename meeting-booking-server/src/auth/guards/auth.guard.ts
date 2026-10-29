import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { ACCESS_TOKEN_COOKIE } from '../auth.constants.js';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp()

    const request = http.getRequest<RequestWithUser>()

    const token: unknown = request.cookies?.[ACCESS_TOKEN_COOKIE]
    if (typeof token !== 'string') {
      throw new UnauthorizedException('Not authenticated')
    }

    try {
      request.user = await this.jwt.verifyAsync<JwtPayload>(token)
    } catch {
      throw new UnauthorizedException('Invalid or expired token')
    }

    return true
  }
}
