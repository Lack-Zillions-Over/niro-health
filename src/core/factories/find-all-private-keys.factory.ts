import { FindAllPrivateKeys } from '../usecases/find-all-private-keys.usecase';
import { PrivateKeyPrismaDB } from '../db/private-keys-prisma.db';

export class FindAllPrivateKeysFactory {
  static async run() {
    return await FindAllPrivateKeys.execute(new PrivateKeyPrismaDB());
  }
}
