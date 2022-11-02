import { createClient } from 'redis';
import { redisOptions } from '@/core/constants';

export class RedisClient {
  constructor() {
    throw new Error('this is static class');
  }

  static async set(key: string, value: string) {
    const client = createClient(redisOptions);

    await client.connect();

    return (async (result) => {
      await client.quit();
      return result.length > 0 ? true : false;
    })(await client.set(key, value));
  }

  static async get(key: string) {
    const client = createClient(redisOptions);

    await client.connect();

    return (async (result) => {
      await client.quit();
      return result.length > 0 ? result : null;
    })(await client.get(key));
  }

  static async keys() {
    const client = createClient(redisOptions);

    await client.connect();

    return (async (result) => {
      await client.quit();
      return result;
    })(await client.keys('*'));
  }

  static async delete(key: string) {
    const client = createClient(redisOptions);

    await client.connect();

    return (async (result) => {
      await client.quit();
      return result > 0 ? true : false;
    })(await client.del(key));
  }
}
