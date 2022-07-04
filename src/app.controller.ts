import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JwtRevalidateGuard } from './auth/guards/jwt-revalidate.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { JWTRevalidate } from './users/types/session.type';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    const session = await this.authService.login(req.user);

    if (session instanceof Error)
      throw new HttpException(session.message, HttpStatus.FORBIDDEN);

    return session;
  }

  @UseGuards(JwtAuthGuard, JwtRevalidateGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    if (!req.tokenRevalidate)
      throw new HttpException(
        `Your credentials is invalid`,
        HttpStatus.FORBIDDEN,
      );

    const token = req.tokenRevalidate as JWTRevalidate,
      session = await this.authService.revalidate({ ...token });

    if (session instanceof Error)
      throw new HttpException(session.message, HttpStatus.FORBIDDEN);

    return session;
  }
}
