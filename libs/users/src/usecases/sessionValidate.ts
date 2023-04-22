import type { INestApplication } from '@nestjs/common';
import type { GeoIP } from '@app/core/types/geo-ip.type';
import { UserRepository } from '@app/users/repositories';
import { UserDatabaseContract } from '@app/users/contracts';

export class SessionValidateUser {
  static async execute(
    id: string,
    token_value: string,
    token_signature: string,
    token_revalidate_value: string,
    token_revalidate_signature: string,
    device_name: string,
    geo_ip: GeoIP,
    database: UserDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new UserRepository(database, app);

    return await repository.sessionValidate(
      id,
      token_value,
      token_signature,
      token_revalidate_value,
      token_revalidate_signature,
      device_name,
      geo_ip,
    );
  }
}
