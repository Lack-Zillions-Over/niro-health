import type { INestApplication } from '@nestjs/common';
import type { CreatePrivateKeyDto } from '@app/private-keys/dto/create';
import { CreatePrivateKey } from '@app/private-keys/usecases/create';
import { PrivateKeyPrismaDB } from '@app/private-keys/db/prisma';

export class CreatePrivateKeyFactory {
  static async run(key: CreatePrivateKeyDto, app: INestApplication) {
    const database = new PrivateKeyPrismaDB(app);
    return await CreatePrivateKey.execute(key, database, app);
  }
}
