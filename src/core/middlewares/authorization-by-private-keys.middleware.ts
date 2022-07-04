import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ValidatePrivateKeyFactory } from '../factories/validate-private-keys.factory';

@Injectable()
export class AuthorizationByPrivateKeysMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers,
      { tag, secret, value } = headers;

    if (
      !(await ValidatePrivateKeyFactory.run(
        tag as string,
        secret as string,
        value as string,
      ))
    )
      throw new HttpException(
        'Private Key is invalid. Try again, later!',
        HttpStatus.UNAUTHORIZED,
      );

    next();
  }
}
