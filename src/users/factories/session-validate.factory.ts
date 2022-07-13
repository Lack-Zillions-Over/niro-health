import { SessionValidateUser } from '@/users/usecases/session-validate-users.usecase';
import { UserPrismaDB } from '@/users/db/users-prisma.db';
import { Locale } from '@/core/libs/i18n.lib';
import { GeoIP } from '@/core/types/geo-ip.type';

export class SessionValidateUserFactory {
  static async run(
    username: string,
    token_value: string,
    token_signature: string,
    token_revalidate_value: string,
    token_revalidate_signature: string,
    device_name: string,
    geo_ip: GeoIP,
    locale: Locale,
  ) {
    return await SessionValidateUser.execute(
      username,
      token_value,
      token_signature,
      token_revalidate_value,
      token_revalidate_signature,
      device_name,
      geo_ip,
      new UserPrismaDB(),
      locale,
    );
  }
}
