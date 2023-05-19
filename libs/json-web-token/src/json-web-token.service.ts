import { Inject, Injectable } from '@nestjs/common';
import { sign, verify, JwtPayload } from 'jsonwebtoken';

import type {
  IJsonWebTokenService,
  PayloadType,
  ExpiresIn,
} from '@app/json-web-token';
import type { IConfigurationService } from '@app/configuration';

/**
 * @description The module provides a service that allows you to create and verify JSON Web Tokens.
 */
@Injectable()
export class JsonWebTokenService implements IJsonWebTokenService {
  constructor(
    @Inject('IConfigurationService')
    private readonly configurationService: IConfigurationService,
  ) {}

  /**
   * @description It takes a payload, a secret, and an expiration time, and returns a signed JWT.
   * @param payload - The data you want to store in the token.
   * @param {string} secret - The secret key used to sign the token.
   * @param expiresIn - This is the time in seconds that the token will be valid for.
   * @returns A JWT token
   */
  public save<T>(
    payload: PayloadType<T>,
    secret: string,
    expiresIn: ExpiresIn,
  ) {
    try {
      return sign(payload, secret || this.configurationService.JWT_SECRET, {
        expiresIn,
      });
    } catch (error) {
      return new Error(error);
    }
  }

  /**
   * @description It takes a token and a secret and returns the payload of the token or an error.
   * @param {string} token - The token to be decoded
   * @param {string} secret - The secret key used to sign the token.
   * @returns The payload of the token.
   */
  public load<T, P = PayloadType<T> & JwtPayload>(
    token: string,
    secret: string,
  ): P | string | Error {
    try {
      return verify(token, secret || this.configurationService.JWT_SECRET) as P;
    } catch (error) {
      return new Error(error);
    }
  }
}
