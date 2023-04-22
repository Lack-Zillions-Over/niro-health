import type { INestApplication } from '@nestjs/common';
import { ValidatePrivateKey } from '@app/private-keys/usecases/validate';
import { PrivateKeyPrismaDB } from '@app/private-keys/db/prisma';

export class ValidatePrivateKeyFactory {
  static async run(
    tag: string,
    secret: string,
    value: string,
    app: INestApplication,
  ) {
    const database = new PrivateKeyPrismaDB(app);
    return await ValidatePrivateKey.execute(tag, secret, value, database, app);
  }
}
