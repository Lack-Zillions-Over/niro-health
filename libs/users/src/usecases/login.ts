import type { INestApplication } from '@nestjs/common';
import type { GeoIP } from '@app/core/types/geo-ip.type';
import { UserRepository } from '@app/users/repositories';
import { UserDatabaseContract } from '@app/users/contracts';

export class LoginUser {
  static async execute(
    email: string,
    password: string,
    device_name: string,
    geo_ip: GeoIP,
    database: UserDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new UserRepository(database, app);

    return await repository.login(email, password, device_name, geo_ip);
  }
}
