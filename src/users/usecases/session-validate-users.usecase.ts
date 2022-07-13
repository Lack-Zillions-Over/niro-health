import { UserRepository } from '@/users/repositories/users.repository';
import { UserDatabaseContract } from '@/users/contracts/users-database.contract';
import { GeoIP } from '@/core/types/geo-ip.type';
import { Locale } from '@/core/libs/i18n.lib';

export class SessionValidateUser {
  static async execute(
    username: string,
    token_value: string,
    token_signature: string,
    token_revalidate_value: string,
    token_revalidate_signature: string,
    device_name: string,
    geo_ip: GeoIP,
    database: UserDatabaseContract,
    locale: Locale,
  ) {
    const repository = new UserRepository(database, locale);

    return await repository.sessionValidate(
      username,
      token_value,
      token_signature,
      token_revalidate_value,
      token_revalidate_signature,
      device_name,
      geo_ip,
    );
  }
}
