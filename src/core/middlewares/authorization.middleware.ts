import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { StringEx } from '../utils/string-ex.util';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers;

    if (
      StringEx.Hash(process.env.MASTER_KEY, 'sha1', 'hex') !==
      headers['authorization']
    )
      throw new HttpException(
        'API Key is invalid. Try again, later!',
        HttpStatus.UNAUTHORIZED,
      );

    next();
  }
}
