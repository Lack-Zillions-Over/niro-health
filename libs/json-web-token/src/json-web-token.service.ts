import { Injectable } from '@nestjs/common';
import { sign, verify, JwtPayload } from 'jsonwebtoken';

import { JsonWebToken } from '@app/json-web-token/json-web-token.interface';

@Injectable()
export class JsonWebTokenService implements JsonWebToken.Class {
  /**
   * It takes a payload, a secret, and an expiration time, and returns a signed JWT
   * @param payload - The data you want to store in the token.
   * @param {string} secret - The secret key used to sign the token.
   * @param expiresIn - This is the time in seconds that the token will be valid for.
   * @returns A JWT token
   */
  public save<T>(
    payload: JsonWebToken.PayloadType<T>,
    secret: string,
    expiresIn: JsonWebToken.ExpiresIn,
  ) {
    try {
      return sign(payload, secret || process.env.JWT_SECRET, {
        expiresIn,
      });
    } catch (error) {
      return new Error(error);
    }
  }

  /**
   * It takes a token and a secret and returns the payload of the token or an error
   * @param {string} token - The token to be decoded
   * @param {string} secret - The secret key used to sign the token.
   * @returns The payload of the token.
   */
  public load<T, P = JsonWebToken.PayloadType<T> & JwtPayload>(
    token: string,
    secret: string,
  ): P | string | Error {
    try {
      return verify(token, secret || process.env.JWT_SECRET) as P;
    } catch (error) {
      return new Error(error);
    }
  }
}
