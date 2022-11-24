import { FileRepository } from '@/files/repositories';
import { FileDatabaseContract } from '@/files/contracts';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class FindAllFiles {
  static async execute(
    query: {
      limit?: number;
      offset?: number;
    },
    database: FileDatabaseContract,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const repository = new FileRepository(database, libsService, utilsService);

    return await repository.findMany(query.limit, query.offset);
  }
}
