import { UserRepository } from '@/users/repositories/users.repository';
import { UserDatabaseContract } from '@/users/contracts/users-database.contract';
import { UpdateUserDto } from '@/users/dto/update-users.dto';
import { Locale } from '@/core/libs/i18n.lib';

export class UpdateUser {
  static async execute(
    id: string,
    newData: UpdateUserDto,
    database: UserDatabaseContract,
    locale: Locale,
  ) {
    const repository = new UserRepository(database, locale),
      user = await repository.findById(id);

    if (user instanceof Error)
      return new Error(
        locale.translate(
          'users.repository.user_not_exists',
          'id',
          id,
        ) as string,
      );

    return await repository.update(id, { ...user, ...newData });
  }
}
