import { UserDatabaseContract } from '../contracts/users-database.contract';
import { User } from '../entities/users.entity';
import prismaClient from '../../core/drivers/prisma-client.driver';

export class UserPrismaDB extends UserDatabaseContract {
  async create(data: User): Promise<User> {
    return (await prismaClient.user.create({ data })) as User;
  }

  async findAll(): Promise<User[]> {
    return (await prismaClient.user.findMany()) as User[];
  }

  async findOne(id: string): Promise<User | never> {
    return (await prismaClient.user.findFirst({ where: { id } })) as
      | User
      | never;
  }

  async findByUsername(username: string): Promise<User | never> {
    return (await prismaClient.user.findFirst({ where: { username } })) as
      | User
      | never;
  }

  async findByEmail(hashed: string): Promise<User | never> {
    return (await prismaClient.user.findFirst({
      where: {
        hash: {
          path: ['email'],
          equals: hashed,
        },
      },
    })) as User | never;
  }

  async update(id: string, newData: User): Promise<User> {
    return (await prismaClient.user.update({
      where: { id },
      data: { ...newData },
    })) as User;
  }

  async remove(id: string): Promise<boolean> {
    if ((await prismaClient.user.count()) <= 0) return false;

    const user = await prismaClient.user.delete({ where: { id } });

    if (!user) return false;

    return true;
  }
}
