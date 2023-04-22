import type { INestApplication } from '@nestjs/common';
import { FindAllFiles } from '@app/files/usecases/findAll';
import { FilePrismaDB } from '@app/files/db/prisma';

export class FindAllFilesFactory {
  static async run(
    query: {
      limit?: number;
      skip?: number;
    },
    app: INestApplication,
  ) {
    const database = new FilePrismaDB(app);
    return await FindAllFiles.execute(query, database, app);
  }
}
