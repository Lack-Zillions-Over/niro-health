import { CreatePrivateKey } from '../usecases/create-private-keys.usecase';
import { PrivateKeyPrismaDB } from '../db/private-keys-prisma.db';
import { CreatePrivateKeyDto } from '../dto/create-private-keys.dto';

export class CreatePrivateKeyFactory {
  static async run(key: CreatePrivateKeyDto) {
    return await CreatePrivateKey.execute(key, new PrivateKeyPrismaDB());
  }
}
