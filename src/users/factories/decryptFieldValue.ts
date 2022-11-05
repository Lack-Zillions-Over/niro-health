import { DecryptFieldValueUser } from '@/users/usecases/decryptFieldValue';
import { UserPrismaDB } from '@/users/db/prisma';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class DecryptFieldValueUserFactory {
  static async run(
    value: string,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new UserPrismaDB(libsService, utilsService, prismaService);

    return await DecryptFieldValueUser.execute(
      value,
      database,
      libsService,
      utilsService,
    );
  }
}
