import type { INestApplication } from '@nestjs/common';
import type { UpdateFileDto } from '@app/files/dto/update';
import { FileRepository } from '@app/files/repositories';
import { FileDatabaseContract } from '@app/files/contracts';

export class UpdateFile {
  static async execute(
    id: string,
    newData: UpdateFileDto,
    database: FileDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new FileRepository(database, app);
    return await repository.update(id, newData);
  }
}
