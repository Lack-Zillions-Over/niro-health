import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersService } from '../users/users.service';
import { Payload } from './types/payload.type';
import { JWTRevalidate } from 'src/users/types/session.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<Payload> {
    const user = await this.usersService.findByUsername(username);

    if (
      !(user instanceof Error) &&
      (await this.usersService.auth(username, password))
    ) {
      return { id: user.id, username: user.username };
    }

    return null;
  }

  async login(payload: Payload) {
    const token_revalidate =
      await this.usersService.generateAndAssignTokenRevalidate(payload.id);

    if (token_revalidate instanceof Error)
      return Error(token_revalidate.message);

    return {
      access_token: this.jwtService.sign(payload),
      access_token_revalidate: this.jwtService.sign(token_revalidate, {
        expiresIn: jwtConstants.revalidateExpiresIn,
      }),
    };
  }

  async revalidate(token: JWTRevalidate) {
    if (!(await this.usersService.validateTokenRevalidate(token)))
      return Error(`Token revalidate is invalid.`);

    return await this.login({ id: token.id, username: token.username });
  }
}
