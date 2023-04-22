import type { INestApplication } from '@nestjs/common';
import { FindByTemporaryFile } from '@app/files/usecases/findByTemporary';
import { FilePrismaDB } from '@app/files/db/prisma';

export class FindByTemporaryFileFactory {
  static async run(app: INestApplication) {
    const database = new FilePrismaDB(app);
    return await FindByTemporaryFile.execute(database, app);
  }
}
