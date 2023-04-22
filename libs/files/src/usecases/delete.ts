import type { INestApplication } from '@nestjs/common';
import { FileRepository } from '@app/files/repositories';
import { FileDatabaseContract } from '@app/files/contracts';

export class DeleteFile {
  static async execute(
    id: string,
    database: FileDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new FileRepository(database, app);
    return await repository.delete(id);
  }
}
