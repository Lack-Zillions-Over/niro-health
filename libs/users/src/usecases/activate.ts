import type { INestApplication } from '@nestjs/common';
import type { i18nService } from '@app/i18n';
import { UserRepository } from '@app/users/repositories';
import { UserDatabaseContract } from '@app/users/contracts';
import { User } from '@app/users/entities';

export class ActivateUser {
  static async execute(
    id: string,
    database: UserDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new UserRepository(database, app);
    const data = await repository.findById(id);

    if (data instanceof Error)
      return new Error(
        (await app
          .get<i18nService>('Ii18nService')
          .translate('users.repository.user_not_exists', 'id', id)) as string,
      );

    const user = new User(data);

    if (user.activate) return user;

    return await repository.update(id, {
      ...user,
      activate: true,
      updatedAt: new Date(),
    });
  }
}
