import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

import { ValidatePrivateKeyFactory } from '@app/private-keys/factories/validate';

import type { Ii18nService } from '@app/i18n';
import type { IConfigurationService } from '@app/configuration';
import type { IStringExService } from '@app/string-ex';
import type { IAppHostService } from '@app/app-host';

/**
 * @description The middleware for check authorization.
 */
@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(
    @Inject('IConfigurationService')
    private readonly configurationService: IConfigurationService,
    @Inject('IStringExService')
    private readonly stringExService: IStringExService,
    @Inject('Ii18nService') private readonly _i18nService: Ii18nService,
    @Inject('IAppHostService')
    private readonly appHostService: IAppHostService,
  ) {}

  /**
   * @description Check if the master key is invalid.
   * @param authorization The master key.
   */
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

  /**
   * @description Check if the private key is invalid.
   * @param tag The tag of private key.
   * @param secret The secret of private key.
   * @param value The value of private key.
   */
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

  /**
   * @description The method for check authorization.
   * @param req The request object.
   * @param res The response object.
   * @param next The next function.
   */
  public async use(req: Request, res: Response, next: NextFunction) {
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
