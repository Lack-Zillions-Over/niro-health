import type { INestApplication } from '@nestjs/common';
import type { UpdatePrivateKeyDto } from '@app/private-keys/dto/update';
import { UpdatePrivateKey } from '@app/private-keys/usecases/update';
import { PrivateKeyPrismaDB } from '@app/private-keys/db/prisma';

export class UpdatePrivateKeyFactory {
  static async run(
    id: string,
    newData: UpdatePrivateKeyDto,
    app: INestApplication,
  ) {
    const database = new PrivateKeyPrismaDB(app);
    return await UpdatePrivateKey.execute(id, newData, database, app);
  }
}
