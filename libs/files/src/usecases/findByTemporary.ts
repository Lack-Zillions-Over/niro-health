import type { INestApplication } from '@nestjs/common';
import { FileRepository } from '@app/files/repositories';
import { FileDatabaseContract } from '@app/files/contracts';

export class FindByTemporaryFile {
  static async execute(database: FileDatabaseContract, app: INestApplication) {
    const repository = new FileRepository(database, app);
    return await repository.findByTemporary();
  }
}
