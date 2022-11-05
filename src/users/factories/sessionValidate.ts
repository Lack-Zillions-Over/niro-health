import { SessionValidateUser } from '@/users/usecases/sessionValidate';
import { UserPrismaDB } from '@/users/db/prisma';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

import { GeoIP } from '@/core/types/geo-ip.type';

export class SessionValidateUserFactory {
  static async run(
    id: string,
    token_value: string,
    token_signature: string,
    token_revalidate_value: string,
    token_revalidate_signature: string,
    device_name: string,
    geo_ip: GeoIP,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new UserPrismaDB(libsService, utilsService, prismaService);

    return await SessionValidateUser.execute(
      id,
      token_value,
      token_signature,
      token_revalidate_value,
      token_revalidate_signature,
      device_name,
      geo_ip,
      database,
      libsService,
      utilsService,
    );
  }
}
