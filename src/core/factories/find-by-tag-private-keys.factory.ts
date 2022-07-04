import { FindByTagPrivateKey } from '../usecases/find-by-tag-private-keys.usecase';
import { PrivateKeyPrismaDB } from '../db/private-keys-prisma.db';

export class FindByTagPrivateKeyFactory {
  static async run(tag: string) {
    return await FindByTagPrivateKey.execute(tag, new PrivateKeyPrismaDB());
  }
}
