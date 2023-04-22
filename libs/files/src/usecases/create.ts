import type { INestApplication } from '@nestjs/common';
import type { CreateFileDto } from '@app/files/dto/create';
import { FileRepository } from '@app/files/repositories';
import { FileDatabaseContract } from '@app/files/contracts';
import { File } from '@app/files/entities';

export class CreateFile {
  static async execute(
    file: CreateFileDto,
    database: FileDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new FileRepository(database, app);
    const entity = new File({ id: database.generateUUID() });

    entity.authorId = file?.authorId;
    entity.name = file?.name;
    entity.description = file?.description;
    entity.mimetype = file?.mimetype;
    entity.size = file?.size;
    entity.compressedSize = file.compressedSize;
    entity.temporary = file?.temporary;
    entity.tags = file?.tags;
    entity.meta = file?.meta;

    return await repository.create(entity);
  }
}
