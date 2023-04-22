import type { INestApplication } from '@nestjs/common';
import { DeleteFile } from '@app/files/usecases/delete';
import { FilePrismaDB } from '@app/files/db/prisma';

export class DeleteFileFactory {
  static async run(id: string, app: INestApplication) {
    const database = new FilePrismaDB(app);
    return await DeleteFile.execute(id, database, app);
  }
}
