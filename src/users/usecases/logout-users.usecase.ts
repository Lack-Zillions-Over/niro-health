import { UserRepository } from '@/users/repositories/users.repository';
import { UserDatabaseContract } from '@/users/contracts/users-database.contract';
import { Locale } from '@/core/libs/i18n.lib';

export class LogoutUser {
  static async execute(
    username: string,
    token_value: string,
    device_name: string,
    database: UserDatabaseContract,
    locale: Locale,
  ) {
    const repository = new UserRepository(database, locale);

    return await repository.logout(username, token_value, device_name);
  }
}
