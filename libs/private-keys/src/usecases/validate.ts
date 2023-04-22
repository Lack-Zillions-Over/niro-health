import type { INestApplication } from '@nestjs/common';
import { PrivateKeyRepository } from '@app/private-keys/repositories';
import { PrivateKeyDatabaseContract } from '@app/private-keys/contracts';

export class ValidatePrivateKey {
  static async execute(
    tag: string,
    secret: string,
    value: string,
    database: PrivateKeyDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new PrivateKeyRepository(database, app);

    return await repository.validate(tag, secret, value);
  }
}
