import { RemovePrivateKey } from '@/privateKeys/usecases/remove';
import { PrivateKeyPrismaDB } from '@/privateKeys/db/prisma';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class RemovePrivateKeyFactory {
  static async run(
    id: string,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new PrivateKeyPrismaDB(
      libsService,
      utilsService,
      prismaService,
    );

    return await RemovePrivateKey.execute(
      id,
      database,
      libsService,
      utilsService,
    );
  }
}
