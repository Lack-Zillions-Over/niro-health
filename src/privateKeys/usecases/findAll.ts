import { PrivateKeyRepository } from '@/privateKeys/repositories';
import { PrivateKeyDatabaseContract } from '@/privateKeys/contracts';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class FindAllPrivateKeys {
  static async execute(
    query: {
      limit?: number;
      offset?: number;
    },
    database: PrivateKeyDatabaseContract,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const repository = new PrivateKeyRepository(
      database,
      libsService,
      utilsService,
    );

    return await repository.findMany(query.limit, query.offset);
  }
}
