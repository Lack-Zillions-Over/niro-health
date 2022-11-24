import { FileRepository } from '@/files/repositories';
import { FileDatabaseContract } from '@/files/contracts';
import { UpdateFileDto } from '@/files/dto/update';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class UpdateFile {
  static async execute(
    id: string,
    newData: UpdateFileDto,
    database: FileDatabaseContract,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const repository = new FileRepository(database, libsService, utilsService);

    return await repository.update(id, newData);
  }
}
