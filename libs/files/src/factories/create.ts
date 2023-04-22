import type { INestApplication } from '@nestjs/common';
import type { CreateFileDto } from '@app/files/dto/create';
import { CreateFile } from '@app/files/usecases/create';
import { FilePrismaDB } from '@app/files/db/prisma';

export class CreateFileFactory {
  static async run(file: CreateFileDto, app: INestApplication) {
    const database = new FilePrismaDB(app);
    return await CreateFile.execute(file, database, app);
  }
}
