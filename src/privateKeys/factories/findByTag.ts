import { FindByTagPrivateKey } from '@/privateKeys/usecases/findByTag';
import { PrivateKeyPrismaDB } from '@/privateKeys/db/prisma';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class FindByTagPrivateKeyFactory {
  static async run(
    tag: string,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new PrivateKeyPrismaDB(
      libsService,
      utilsService,
      prismaService,
    );

    return await FindByTagPrivateKey.execute(
      tag,
      database,
      libsService,
      utilsService,
    );
  }
}
