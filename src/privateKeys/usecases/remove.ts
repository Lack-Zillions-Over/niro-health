import { PrivateKeyRepository } from '@/privateKeys/repositories';
import { PrivateKeyDatabaseContract } from '@/privateKeys/contracts';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class RemovePrivateKey {
  static async execute(
    id: string,
    database: PrivateKeyDatabaseContract,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const repository = new PrivateKeyRepository(
      database,
      libsService,
      utilsService,
    );

    return await repository.remove(id);
  }
}
