import type { INestApplication } from '@nestjs/common';
import type { File } from '@app/files/entities';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { Type } from '@app/similarity-filter';
import { FindByFile } from '@app/files/usecases/findBy';
import { FilePrismaDB } from '@app/files/db/prisma';

export class FindByFileFactory {
  static async run(
    filter: RecursivePartial<File>,
    similarity: Type,
    app: INestApplication,
  ) {
    const database = new FilePrismaDB(app);
    return await FindByFile.execute(filter, similarity, database, app);
  }
}
