import { FileRepository } from '@/files/repositories';
import { FileDatabaseContract } from '@/files/contracts';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class RemoveFile {
  static async execute(
    id: string,
    database: FileDatabaseContract,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const repository = new FileRepository(database, libsService, utilsService);

    return await repository.remove(id);
  }
}
