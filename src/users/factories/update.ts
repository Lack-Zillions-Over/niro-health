import { UpdateUser } from '@/users/usecases/update';
import { UserPrismaDB } from '@/users/db/prisma';
import { UpdateUserDto } from '@/users/dto/update';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class UpdateUserFactory {
  static async run(
    id: string,
    newData: UpdateUserDto,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new UserPrismaDB(libsService, utilsService, prismaService);

    return await UpdateUser.execute(
      id,
      newData,
      database,
      libsService,
      utilsService,
    );
  }
}
