import { sign, verify, JwtPayload } from 'jsonwebtoken';

import { JsonWebToken as Types } from '@/core/libs/jwt/types';

export class JsonWebToken<T> implements Types.Class {
  constructor(private readonly payload: Types.PayloadType<T>) {}

  public save(secret: string, expiresIn: `${number}${'m' | 'd'}`) {
    try {
      return sign(this.payload, secret || process.env.JWT_SECRET, {
        expiresIn,
      });
    } catch (error) {
      return new Error(error as string);
    }
  }

  public load<T = JwtPayload>(
    token: string,
    secret: string,
  ): T | string | Error {
    try {
      return verify(token, secret || process.env.JWT_SECRET) as T;
    } catch (error) {
      return new Error(error as string);
    }
  }
}
