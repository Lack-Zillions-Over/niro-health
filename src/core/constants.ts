import { RedisClientOptions } from 'redis';

import * as https from 'https';

import { ProjectOptions } from '@/constants';

export const redisOptions: RedisClientOptions = {
  database: ProjectOptions.redis.database,
  url: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
};

export const awsOptions = {
  apiVersion: ProjectOptions.aws.apiVersion,
  region: ProjectOptions.aws.region,
  httpsAgent: {
    maxSockets: ProjectOptions.aws.httpsAgent.maxSockets,
    keepAlive: ProjectOptions.aws.httpsAgent.keepAlive,
    keepAliveMsecs: ProjectOptions.aws.httpsAgent.keepAliveMsecs,
  },
};

export const awsConfiguration = {
  apiVersion: ProjectOptions.aws.apiVersion,
  region: ProjectOptions.aws.region,
  httpOptions: {
    agent: new https.Agent({
      maxSockets: awsOptions.httpsAgent.maxSockets,
      keepAlive: awsOptions.httpsAgent.keepAlive,
      keepAliveMsecs: awsOptions.httpsAgent.keepAliveMsecs,
    }),
  },
};
