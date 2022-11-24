import { RedisClientOptions } from 'redis';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import * as https from 'https';

import { ProjectOptions } from '@/constants';

declare type ClientConfiguration = ServiceConfigurationOptions & {
  apiVersion?: '2006-03-01' | 'latest' | string;
};

export const redisOptions: RedisClientOptions = {
  database: ProjectOptions.redis.database,
  url: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
};

export const awsConfiguration: ClientConfiguration = {
  apiVersion: ProjectOptions.aws.apiVersion,
  region: ProjectOptions.aws.region,
  httpOptions: {
    agent: new https.Agent({
      maxSockets: ProjectOptions.aws.httpsAgent.maxSockets,
      keepAlive: ProjectOptions.aws.httpsAgent.keepAlive,
      keepAliveMsecs: ProjectOptions.aws.httpsAgent.keepAliveMsecs,
    }),
  },
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};
