import type { INestApplication } from '@nestjs/common';
import { FindByIdFile } from '@app/files/usecases/findById';
import { FilePrismaDB } from '@app/files/db/prisma';

export class FindByIdFileFactory {
  static async run(id: string, app: INestApplication) {
    const database = new FilePrismaDB(app);
    return await FindByIdFile.execute(id, database, app);
  }
}
