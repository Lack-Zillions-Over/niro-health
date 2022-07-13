import { LogoutUser } from '@/users/usecases/logout-users.usecase';
import { UserPrismaDB } from '@/users/db/users-prisma.db';
import { Locale } from '@/core/libs/i18n.lib';

export class LogoutUserFactory {
  static async run(
    username: string,
    token_value: string,
    device_name: string,
    locale: Locale,
  ) {
    return await LogoutUser.execute(
      username,
      token_value,
      device_name,
      new UserPrismaDB(),
      locale,
    );
  }
}
