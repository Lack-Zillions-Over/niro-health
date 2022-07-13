import { RemoveUser } from '@/users/usecases/remove-users.usecase';
import { UserPrismaDB } from '@/users/db/users-prisma.db';
import { Locale } from '@/core/libs/i18n.lib';

export class RemoveUserFactory {
  static async run(id: string, locale: Locale) {
    return await RemoveUser.execute(id, new UserPrismaDB(), locale);
  }
}
