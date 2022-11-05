import { UserRepository } from '@/users/repositories';
import { UserDatabaseContract } from '@/users/contracts';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class ActivateUser {
  static async execute(
    id: string,
    database: UserDatabaseContract,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const repository = new UserRepository(database, libsService, utilsService);
    const user = await repository.findById(id);

    if (user instanceof Error)
      return new Error(
        libsService
          .i18n()
          .translate('users.repository.user_not_exists', 'id', id) as string,
      );

    if (user.activate) return user;

    return await repository.update(id, {
      ...user,
      activate: true,
      updatedAt: new Date(),
    });
  }
}