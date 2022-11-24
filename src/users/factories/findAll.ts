import { FindAllUsers } from '@/users/usecases/findAll';
import { UserPrismaDB } from '@/users/db/prisma';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class FindAllUsersFactory {
  static async run(
    query: {
      limit?: number;
      offset?: number;
    },
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new UserPrismaDB(libsService, utilsService, prismaService);

    return await FindAllUsers.execute(
      query,
      database,
      libsService,
      utilsService,
    );
  }
}
