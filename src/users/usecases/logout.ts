import { UserRepository } from '@/users/repositories';
import { UserDatabaseContract } from '@/users/contracts';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class LogoutUser {
  static async execute(
    id: string,
    token_value: string,
    database: UserDatabaseContract,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const repository = new UserRepository(database, libsService, utilsService);

    return await repository.logout(id, token_value);
  }
}
