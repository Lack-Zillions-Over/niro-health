import { Redis as Types } from '@/core/libs/redis/types';
import { RedisClient } from '@/core/drivers/redis-client.driver';

export class Redis implements Types.Class {
  public async save(key: string, value: string): Promise<boolean> {
    return await RedisClient.set(key, value);
  }

  public async update(key: string, newValue: string): Promise<boolean> {
    if (!(await RedisClient.get(key))) return false;

    return await RedisClient.set(key, newValue);
  }

  public async findAll(): Promise<string[]> {
    const keys = await RedisClient.keys();

    const values: string[] = [];

    for (const key of keys) {
      const value = await RedisClient.get(key);

      if (value) values.push(value);
    }

    return values;
  }

  public async findOne(key: string): Promise<string | null> {
    return await RedisClient.get(key);
  }

  public async delete(key: string): Promise<boolean> {
    return await RedisClient.delete(key);
  }
}
