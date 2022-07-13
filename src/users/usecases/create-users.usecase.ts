import { UserRepository } from '@/users/repositories/users.repository';
import { UserDatabaseContract } from '@/users/contracts/users-database.contract';
import { CreateUserDto } from '@/users/dto/create-users.dto';
import { Locale } from '@/core/libs/i18n.lib';

export class CreateUser {
  static async execute(
    user: CreateUserDto,
    database: UserDatabaseContract,
    locale: Locale,
  ) {
    const repository = new UserRepository(database, locale);

    return await repository.register({
      ...user,
      id: database.generateID(),
      hash: {
        email: database.hashByText(user.email),
      },
    });
  }
}
