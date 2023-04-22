import type { INestApplication } from '@nestjs/common';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { Type } from '@app/similarity-filter';
import { FileRepository } from '@app/files/repositories';
import { FileDatabaseContract } from '@app/files/contracts';
import { File } from '@app/files/entities';

export class FindByFile {
  static async execute(
    filter: RecursivePartial<File>,
    similarity: Type,
    database: FileDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new FileRepository(database, app);
    return await repository.findBy(filter, similarity);
  }
}
