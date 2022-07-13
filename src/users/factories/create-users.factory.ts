import { CreateUser } from '@/users/usecases/create-users.usecase';
import { UserPrismaDB } from '@/users/db/users-prisma.db';
import { CreateUserDto } from '@/users/dto/create-users.dto';
import { Locale } from '@/core/libs/i18n.lib';

export class CreateUserFactory {
  static async run(user: CreateUserDto, locale: Locale) {
    return await CreateUser.execute(user, new UserPrismaDB(), locale);
  }
}
