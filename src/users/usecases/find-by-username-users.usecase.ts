import { UserRepository } from '@/users/repositories/users.repository';
import { UserDatabaseContract } from '@/users/contracts/users-database.contract';
import { Locale } from '@/core/libs/i18n.lib';

export class FindByUsernameUser {
  static async execute(
    username: string,
    database: UserDatabaseContract,
    locale: Locale,
  ) {
    const repository = new UserRepository(database, locale);

    return await repository.findByUsername(username);
  }
}
