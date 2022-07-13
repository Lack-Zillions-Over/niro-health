import { FindByUsernameUser } from '@/users/usecases/find-by-username-users.usecase';
import { UserPrismaDB } from '@/users/db/users-prisma.db';
import { Locale } from '@/core/libs/i18n.lib';

export class FindByUsernameUserFactory {
  static async run(username: string, locale: Locale) {
    return await FindByUsernameUser.execute(
      username,
      new UserPrismaDB(),
      locale,
    );
  }
}
