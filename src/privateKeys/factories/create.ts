import { CreatePrivateKey } from '@/privateKeys/usecases/create';
import { PrivateKeyPrismaDB } from '@/privateKeys/db/prisma';
import { CreatePrivateKeyDto } from '@/privateKeys/dto/create';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class CreatePrivateKeyFactory {
  static async run(
    key: CreatePrivateKeyDto,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new PrivateKeyPrismaDB(
      libsService,
      utilsService,
      prismaService,
    );

    return await CreatePrivateKey.execute(
      key,
      database,
      libsService,
      utilsService,
    );
  }
}
