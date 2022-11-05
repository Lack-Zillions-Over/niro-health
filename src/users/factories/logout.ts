import { LogoutUser } from '@/users/usecases/logout';
import { UserPrismaDB } from '@/users/db/prisma';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class LogoutUserFactory {
  static async run(
    id: string,
    token_value: string,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new UserPrismaDB(libsService, utilsService, prismaService);

    return await LogoutUser.execute(
      id,
      token_value,
      database,
      libsService,
      utilsService,
    );
  }
}
