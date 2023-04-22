import type { INestApplication } from '@nestjs/common';
import { FindByTagPrivateKey } from '@app/private-keys/usecases/findByTag';
import { PrivateKeyPrismaDB } from '@app/private-keys/db/prisma';

export class FindByTagPrivateKeyFactory {
  static async run(tag: string, app: INestApplication) {
    const database = new PrivateKeyPrismaDB(app);
    return await FindByTagPrivateKey.execute(tag, database, app);
  }
}
