import type { INestApplication } from '@nestjs/common';
import type { CreatePrivateKeyDto } from '@app/private-keys/dto/create';
import { PrivateKeyRepository } from '@app/private-keys/repositories';
import { PrivateKeyDatabaseContract } from '@app/private-keys/contracts';
import { PrivateKey } from '@app/private-keys/entities';

export class CreatePrivateKey {
  static async execute(
    key: CreatePrivateKeyDto,
    database: PrivateKeyDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new PrivateKeyRepository(database, app);
    const entity = new PrivateKey({
      id: database.generateUUID(),
      value: database.generateValue(),
      tag: key.tag,
      secret: key.secret,
    });

    return await repository.create(entity);
  }
}
