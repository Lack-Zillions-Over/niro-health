import { PrivateKeyRepository } from '@/privateKeys/repositories';
import { PrivateKeyDatabaseContract } from '@/privateKeys/contracts';
import { UpdatePrivateKeyDto } from '@/privateKeys/dto/update';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class UpdatePrivateKey {
  static async execute(
    id: string,
    newData: UpdatePrivateKeyDto,
    database: PrivateKeyDatabaseContract,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const repository = new PrivateKeyRepository(
      database,
      libsService,
      utilsService,
    );

    const key = await repository.findById(id);

    if (key instanceof Error)
      return new Error(
        libsService
          .i18n()
          .translate(
            'private-keys.repository.private_key_not_found',
            'id',
            id,
          ) as string,
      );

    return await repository.update(id, {
      ...key,
      ...newData,
      updatedAt: new Date(),
    });
  }
}
