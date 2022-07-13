import { RedisClient } from '@/core/drivers/redis-client.driver';

export class Redis {
  async save(key: string, value: string): Promise<boolean> {
    return await RedisClient.set(key, value);
  }

  async update(key: string, newValue: string): Promise<boolean> {
    if (!(await RedisClient.get(key))) return false;

    return await RedisClient.set(key, newValue);
  }

  async findAll(): Promise<string[]> {
    const keys = await RedisClient.keys();

    const values: string[] = [];

    for (const key of keys) {
      const value = await RedisClient.get(key);

      if (value) values.push(value);
    }

    return values;
  }

  async findOne(key: string): Promise<string | never> {
    return await RedisClient.get(key);
  }

  async delete(key: string): Promise<boolean> {
    return await RedisClient.delete(key);
  }
}
