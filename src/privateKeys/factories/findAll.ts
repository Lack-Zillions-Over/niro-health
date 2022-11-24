import { FindAllPrivateKeys } from '@/privateKeys/usecases/findAll';
import { PrivateKeyPrismaDB } from '@/privateKeys/db/prisma';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class FindAllPrivateKeysFactory {
  static async run(
    query: {
      limit?: number;
      offset?: number;
    },
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new PrivateKeyPrismaDB(
      libsService,
      utilsService,
      prismaService,
    );

    return await FindAllPrivateKeys.execute(
      query,
      database,
      libsService,
      utilsService,
    );
  }
}
