import type { INestApplication } from '@nestjs/common';
import type { UpdateUserDto } from '@app/users/dto/update';
import type { i18nService } from '@app/i18n';
import { UserRepository } from '@app/users/repositories';
import { UserDatabaseContract } from '@app/users/contracts';

export class UpdateUser {
  static async execute(
    id: string,
    newData: UpdateUserDto,
    database: UserDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new UserRepository(database, app);
    const user = await repository.findById(id);

    if (user instanceof Error)
      return new Error(
        (await app
          .get<i18nService>('Ii18nService')
          .translate('users.repository.user_not_exists', 'id', id)) as string,
      );

    return await repository.update(id, {
      ...user,
      ...newData,
      updatedAt: new Date(),
    });
  }
}
