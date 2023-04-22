import type { INestApplication } from '@nestjs/common';
import type { GeoIP } from '@app/core/types/geo-ip.type';
import { SessionValidateUser } from '@app/users/usecases/sessionValidate';
import { UserPrismaDB } from '@app/users/db/prisma';

export class SessionValidateUserFactory {
  static async run(
    id: string,
    token_value: string,
    token_signature: string,
    token_revalidate_value: string,
    token_revalidate_signature: string,
    device_name: string,
    geo_ip: GeoIP,
    app: INestApplication,
  ) {
    const database = new UserPrismaDB(app);
    return await SessionValidateUser.execute(
      id,
      token_value,
      token_signature,
      token_revalidate_value,
      token_revalidate_signature,
      device_name,
      geo_ip,
      database,
      app,
    );
  }
}
