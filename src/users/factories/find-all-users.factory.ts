import { FindAllUsers } from '@/users/usecases/find-all-users.usecase';
import { UserPrismaDB } from '@/users/db/users-prisma.db';
import { Locale } from '@/core/libs/i18n.lib';

export class FindAllUsersFactory {
  static async run(locale: Locale) {
    return await FindAllUsers.execute(new UserPrismaDB(), locale);
  }
}
