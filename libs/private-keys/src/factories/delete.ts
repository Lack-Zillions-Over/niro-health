import type { INestApplication } from '@nestjs/common';
import { DeletePrivateKey } from '@app/private-keys/usecases/delete';
import { PrivateKeyPrismaDB } from '@app/private-keys/db/prisma';

export class DeletePrivateKeyFactory {
  static async run(id: string, app: INestApplication) {
    const database = new PrivateKeyPrismaDB(app);
    return await DeletePrivateKey.execute(id, database, app);
  }
}
