import { ValidatePrivateKey } from '../usecases/validate-private-keys.usecase';
import { PrivateKeyPrismaDB } from '../db/private-keys-prisma.db';

export class ValidatePrivateKeyFactory {
  static async run(tag: string, secret: string, value: string) {
    return await ValidatePrivateKey.execute(
      tag,
      secret,
      value,
      new PrivateKeyPrismaDB(),
    );
  }
}
