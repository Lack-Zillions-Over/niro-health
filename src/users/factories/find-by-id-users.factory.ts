import { FindByIdUser } from '@/users/usecases/find-by-id-users.usecase';
import { UserPrismaDB } from '@/users/db/users-prisma.db';
import { Locale } from '@/core/libs/i18n.lib';

export class FindByIdUserFactory {
  static async run(id: string, locale: Locale) {
    return await FindByIdUser.execute(id, new UserPrismaDB(), locale);
  }
}
