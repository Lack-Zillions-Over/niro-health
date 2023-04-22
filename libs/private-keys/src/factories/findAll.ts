import type { INestApplication } from '@nestjs/common';
import { FindAllPrivateKeys } from '@app/private-keys/usecases/findAll';
import { PrivateKeyPrismaDB } from '@app/private-keys/db/prisma';

export class FindAllPrivateKeysFactory {
  static async run(
    query: {
      limit?: number;
      offset?: number;
    },
    app: INestApplication,
  ) {
    const database = new PrivateKeyPrismaDB(app);
    return await FindAllPrivateKeys.execute(query, database, app);
  }
}
