import { RedisClientOptions } from 'redis';

export const redisOptions: RedisClientOptions = {
  database: 1,
  url: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
};
