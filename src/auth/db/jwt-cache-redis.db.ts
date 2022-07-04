import { JwtCacheDatabaseContract } from '../contracts/jwt-cache-database.contract';
import { RedisClient } from '../../core/drivers/redis-client.driver';

export class JwtCacheRedisDB implements JwtCacheDatabaseContract {
  async save(key: string, jwt: string): Promise<boolean> {
    return await RedisClient.set(key, jwt);
  }

  async update(key: string, newJwt: string): Promise<boolean> {
    return await RedisClient.set(key, newJwt);
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
