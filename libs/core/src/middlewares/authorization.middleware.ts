// import {
//   HttpException,
//   HttpStatus,
//   Injectable,
//   NestMiddleware,
// } from '@nestjs/common';

// import { Request, Response, NextFunction } from 'express';

// import { ValidatePrivateKeyFactory } from '@app/private-keys/factories/validate';

// import { PrismaService } from '@app/core/prisma/prisma.service';
// import { ConfigurationService } from '@app/configuration';
// import { StringExService } from '@app/string-ex';

// @Injectable()
// export class AuthorizationMiddleware implements NestMiddleware {
//   constructor(
//     private readonly configurationService: ConfigurationService,
//     private readonly stringExService: StringExService,
//     private readonly prismaService: PrismaService,
//   ) {}

//   private async _invalidMasterKey(authorization: string) {
//     if (
//       this.stringExService.hash(
//         this.configurationService.MASTER_KEY,
//         'sha1',
//         'hex',
//       ) !== authorization
//     )
//       return true;

//     return false;
//   }

//   private async _invalidPrivateKey(tag: string, secret: string, value: string) {
//     const key = await ValidatePrivateKeyFactory.run(
//       tag as string,
//       secret as string,
//       value as string,
//       this.prismaService,
//     );

//     if (!key || key instanceof Error) return true;

//     return false;
//   }

//   async use(req: Request, res: Response, next: NextFunction) {
//     const headers = req.headers,
//       authorization = headers.authorization,
//       tag = headers.key_tag as string,
//       secret = headers.key_secret as string,
//       value = headers.key_value as string;

//     if (
//       ((await this._invalidMasterKey(authorization)) &&
//         (!tag || !secret || !value)) ||
//       ((await this._invalidMasterKey(authorization)) &&
//         (await this._invalidPrivateKey(tag, secret, value)))
//     )
//       throw new HttpException(
//         this.libsService
//           .i18n()
//           .translate('middlewares.authorization.exception') as string,
//         HttpStatus.UNAUTHORIZED,
//       );

//     next();
//   }
// }
