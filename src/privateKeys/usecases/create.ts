import { PrivateKeyRepository } from '@/privateKeys/repositories';
import { PrivateKeyDatabaseContract } from '@/privateKeys/contracts';
import { CreatePrivateKeyDto } from '@/privateKeys/dto/create';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class CreatePrivateKey {
  static async execute(
    key: CreatePrivateKeyDto,
    database: PrivateKeyDatabaseContract,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const repository = new PrivateKeyRepository(
      database,
      libsService,
      utilsService,
    );

    return await repository.register({
      ...key,
      id: database.generateID(),
      value: database.generateValue(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
