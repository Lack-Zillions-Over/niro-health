import { ValidatePrivateKey } from '@/privateKeys/usecases/validate';
import { PrivateKeyPrismaDB } from '@/privateKeys/db/prisma';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class ValidatePrivateKeyFactory {
  static async run(
    tag: string,
    secret: string,
    value: string,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new PrivateKeyPrismaDB(
      libsService,
      utilsService,
      prismaService,
    );

    return await ValidatePrivateKey.execute(
      tag,
      secret,
      value,
      database,
      libsService,
      utilsService,
    );
  }
}
