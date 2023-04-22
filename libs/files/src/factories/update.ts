import type { INestApplication } from '@nestjs/common';
import type { UpdateFileDto } from '@app/files/dto/update';
import { UpdateFile } from '@app/files/usecases/update';
import { FilePrismaDB } from '@app/files/db/prisma';

export class UpdateFileFactory {
  static async run(id: string, newData: UpdateFileDto, app: INestApplication) {
    const database = new FilePrismaDB(app);
    return await UpdateFile.execute(id, newData, database, app);
  }
}
