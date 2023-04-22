import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

import { ValidatePrivateKeyFactory } from '@app/private-keys/factories/validate';

import { Ii18nService } from '@app/i18n';
import { IConfigurationService } from '@app/configuration';
import { IStringExService } from '@app/string-ex';
import { AppHostService } from '@app/app-host';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(
    @Inject('IConfigurationService')
    private readonly configurationService: IConfigurationService,
    @Inject('IStringExService')
    private readonly stringExService: IStringExService,
    @Inject('Ii18nService') private readonly _i18nService: Ii18nService,
    private readonly appHostService: AppHostService,
  ) {}

  private async _invalidMasterKey(authorization: string) {
    if (
      this.stringExService.hash(
        this.configurationService.MASTER_KEY,
        'sha256',
        'hex',
      ) !== authorization
    )
      return true;

    return false;
  }

  private async _invalidPrivateKey(tag: string, secret: string, value: string) {
    const key = await ValidatePrivateKeyFactory.run(
      tag as string,
      secret as string,
      value as string,
      this.appHostService.app,
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
        (await this._i18nService.translate(
          'middlewares.authorization.exception',
        )) as string,
        HttpStatus.UNAUTHORIZED,
      );

    next();
  }
}
