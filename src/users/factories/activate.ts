import { ActivateUser } from '@/users/usecases/activate';
import { UserPrismaDB } from '@/users/db/prisma';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class ActivateUserFactory {
  static async run(
    id: string,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new UserPrismaDB(libsService, utilsService, prismaService);

    return await ActivateUser.execute(id, database, libsService, utilsService);
  }
}
