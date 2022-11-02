import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

import { ValidatePrivateKeyFactory } from '@/privateKeys/factories/validate';

import { PrismaService } from '@/core/prisma/prisma.service';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly libsService: LibsService,
    private readonly utilsService: UtilsService,
  ) {}

  private async _invalidMasterKey(authorization: string) {
    if (
      this.utilsService
        .stringEx()
        .hash(process.env.MASTER_KEY, 'sha1', 'hex') !== authorization
    )
      return true;

    return false;
  }

  private async _invalidPrivateKey(tag: string, secret: string, value: string) {
    const key = await ValidatePrivateKeyFactory.run(
      tag as string,
      secret as string,
      value as string,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );

    if (!key || key instanceof Error) return true;

    return false;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers,
      authorization = headers.authorization,
      tag = headers.key_tag as string,
      secret = headers.key_secret as string,
      value = headers.key_value as string;

    if (
      ((await this._invalidMasterKey(authorization)) &&
        (!tag || !secret || !value)) ||
      ((await this._invalidMasterKey(authorization)) &&
        (await this._invalidPrivateKey(tag, secret, value)))
    )
      throw new HttpException(
        this.libsService
          .i18n()
          .translate('middlewares.authorization.exception') as string,
        HttpStatus.UNAUTHORIZED,
      );

    next();
  }
}
