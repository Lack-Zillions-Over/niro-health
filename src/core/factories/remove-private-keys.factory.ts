import { RemovePrivateKey } from '../usecases/remove-private-keys.usecase';
import { PrivateKeyPrismaDB } from '../db/private-keys-prisma.db';

export class RemovePrivateKeyFactory {
  static async run(id: string) {
    return await RemovePrivateKey.execute(id, new PrivateKeyPrismaDB());
  }
}
