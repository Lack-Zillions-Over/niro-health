import { UpdatePrivateKey } from '../usecases/update-private-keys.usecase';
import { PrivateKeyPrismaDB } from '../db/private-keys-prisma.db';
import { UpdatePrivateKeyDto } from '../dto/update-private-keys.dto';

export class UpdatePrivateKeyFactory {
  static async run(id: string, newData: UpdatePrivateKeyDto) {
    return await UpdatePrivateKey.execute(
      id,
      newData,
      new PrivateKeyPrismaDB(),
    );
  }
}
