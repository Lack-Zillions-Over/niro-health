import { FileRepository } from '@/files/repositories';
import { FileDatabaseContract } from '@/files/contracts';
import { CreateFileDto } from '@/files/dto/create';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class CreateFile {
  static async execute(
    file: CreateFileDto,
    database: FileDatabaseContract,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const repository = new FileRepository(database, libsService, utilsService);

    return await repository.register({
      ...file,
      id: database.generateID(),
      description: file.description || '',
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
