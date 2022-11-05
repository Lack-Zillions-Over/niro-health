import { UserRepository } from '@/users/repositories';
import { UserDatabaseContract } from '@/users/contracts';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class FindAllUsers {
  static async execute(
    database: UserDatabaseContract,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const repository = new UserRepository(database, libsService, utilsService);

    return await repository.findMany();
  }
}
