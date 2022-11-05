import { CreateUser } from '@/users/usecases/create';
import { UserPrismaDB } from '@/users/db/prisma';
import { CreateUserDto } from '@/users/dto/create';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class CreateUserFactory {
  static async run(
    user: CreateUserDto,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new UserPrismaDB(libsService, utilsService, prismaService);

    return await CreateUser.execute(user, database, libsService, utilsService);
  }
}
