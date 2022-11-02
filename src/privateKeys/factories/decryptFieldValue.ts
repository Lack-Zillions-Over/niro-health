import { DecryptFieldValuePrivateKey } from '@/privateKeys/usecases/decryptFieldValue';
import { PrivateKeyPrismaDB } from '@/privateKeys/db/prisma';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class DecryptFieldValuePrivateKeyFactory {
  static async run(
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

    return await DecryptFieldValuePrivateKey.execute(
      value,
      database,
      libsService,
      utilsService,
    );
  }
}
