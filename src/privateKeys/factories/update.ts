import { UpdatePrivateKey } from '@/privateKeys/usecases/update';
import { PrivateKeyPrismaDB } from '@/privateKeys/db/prisma';
import { UpdatePrivateKeyDto } from '@/privateKeys/dto/update';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class UpdatePrivateKeyFactory {
  static async run(
    id: string,
    newData: UpdatePrivateKeyDto,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new PrivateKeyPrismaDB(
      libsService,
      utilsService,
      prismaService,
    );

    return await UpdatePrivateKey.execute(
      id,
      newData,
      database,
      libsService,
      utilsService,
    );
  }
}
