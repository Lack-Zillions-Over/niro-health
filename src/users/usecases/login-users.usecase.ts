import { UserRepository } from '@/users/repositories/users.repository';
import { UserDatabaseContract } from '@/users/contracts/users-database.contract';
import { GeoIP } from '@/core/types/geo-ip.type';
import { Locale } from '@/core/libs/i18n.lib';

export class LoginUser {
  static async execute(
    username: string,
    password: string,
    device_name: string,
    geo_ip: GeoIP,
    database: UserDatabaseContract,
    locale: Locale,
  ) {
    const repository = new UserRepository(database, locale);

    return await repository.login(username, password, device_name, geo_ip);
  }
}
