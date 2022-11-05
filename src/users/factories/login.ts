import { LoginUser } from '@/users/usecases/login';
import { UserPrismaDB } from '@/users/db/prisma';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

import { GeoIP } from '@/core/types/geo-ip.type';

export class LoginUserFactory {
  static async run(
    email: string,
    password: string,
    device_name: string,
    geo_ip: GeoIP,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new UserPrismaDB(libsService, utilsService, prismaService);

    return await LoginUser.execute(
      email,
      password,
      device_name,
      geo_ip,
      database,
      libsService,
      utilsService,
    );
  }
}
