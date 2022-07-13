import { UpdateUser } from '@/users/usecases/update-users.usecase';
import { UserPrismaDB } from '@/users/db/users-prisma.db';
import { UpdateUserDto } from '@/users/dto/update-users.dto';
import { Locale } from '@/core/libs/i18n.lib';

export class UpdateUserFactory {
  static async run(id: string, newData: UpdateUserDto, locale: Locale) {
    return await UpdateUser.execute(id, newData, new UserPrismaDB(), locale);
  }
}
