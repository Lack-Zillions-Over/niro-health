import type { INestApplication } from '@nestjs/common';
import { FileRepository } from '@app/files/repositories';
import { FileDatabaseContract } from '@app/files/contracts';

export class FindAllFiles {
  static async execute(
    query: {
      limit?: number;
      skip?: number;
    },
    database: FileDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new FileRepository(database, app);
    return await repository.findAll(query.limit, query.skip);
  }
}
