import type { INestApplication } from '@nestjs/common';
import type { UpdatePrivateKeyDto } from '@app/private-keys/dto/update';
import type { i18nService } from '@app/i18n';
import { PrivateKeyRepository } from '@app/private-keys/repositories';
import { PrivateKeyDatabaseContract } from '@app/private-keys/contracts';

export class UpdatePrivateKey {
  static async execute(
    id: string,
    newData: UpdatePrivateKeyDto,
    database: PrivateKeyDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new PrivateKeyRepository(database, app);
    const key = await repository.findById(id);

    if (key instanceof Error)
      return new Error(
        (await app
          .get<i18nService>('Ii18nService')
          .translate(
            'private-keys.repository.private_key_not_found',
            'id',
            id,
          )) as string,
      );

    return await repository.update(id, {
      ...key,
      ...newData,
      updatedAt: new Date(),
    });
  }
}
