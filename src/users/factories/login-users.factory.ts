import { LoginUser } from '@/users/usecases/login-users.usecase';
import { UserPrismaDB } from '@/users/db/users-prisma.db';
import { Locale } from '@/core/libs/i18n.lib';
import { GeoIP } from '@/core/types/geo-ip.type';

export class LoginUserFactory {
  static async run(
    username: string,
    password: string,
    device_name: string,
    geo_ip: GeoIP,
    locale: Locale,
  ) {
    return await LoginUser.execute(
      username,
      password,
      device_name,
      geo_ip,
      new UserPrismaDB(),
      locale,
    );
  }
}
