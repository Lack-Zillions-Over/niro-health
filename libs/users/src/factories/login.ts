import type { INestApplication } from '@nestjs/common';
import type { GeoIP } from '@app/core/types/geo-ip.type';
import { LoginUser } from '@app/users/usecases/login';
import { UserPrismaDB } from '@app/users/db/prisma';

export class LoginUserFactory {
  static async run(
    email: string,
    password: string,
    device_name: string,
    geo_ip: GeoIP,
    app: INestApplication,
  ) {
    const database = new UserPrismaDB(app);
    return await LoginUser.execute(
      email,
      password,
      device_name,
      geo_ip,
      database,
      app,
    );
  }
}
