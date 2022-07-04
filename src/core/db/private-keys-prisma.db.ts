import { PrivateKeyDatabaseContract } from '../contracts/private-keys-database.contract';
import { PrivateKey } from '../entities/private-keys.entity';
import prismaClient from '../drivers/prisma-client.driver';

export class PrivateKeyPrismaDB extends PrivateKeyDatabaseContract {
  async create(data: PrivateKey): Promise<PrivateKey> {
    return await prismaClient.privateKey.create({ data });
  }

  async findAll(): Promise<PrivateKey[]> {
    return await prismaClient.privateKey.findMany();
  }

  async findOne(id: string): Promise<PrivateKey | never> {
    return await prismaClient.privateKey.findFirst({ where: { id } });
  }

  async findByTag(tag: string): Promise<PrivateKey | never> {
    return await prismaClient.privateKey.findFirst({ where: { tag } });
  }

  async update(id: string, newData: PrivateKey): Promise<PrivateKey> {
    return await prismaClient.privateKey.update({
      where: { id },
      data: { ...newData },
    });
  }

  async remove(id: string): Promise<boolean> {
    if ((await prismaClient.privateKey.count()) <= 0) return false;

    const key = await prismaClient.privateKey.delete({ where: { id } });

    if (!key) return false;

    return true;
  }
}
