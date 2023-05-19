import type { INestApplication } from '@nestjs/common';
import type { Db } from 'mongoose/lib';

export interface User {
  username: string;
  password: string;
}

export interface Config extends User {
  host: string;
  port: string;
  database: string;
  connection: {
    ssl: boolean;
  };
  project: {
    name: string;
  };
}

export interface IMongoDBService {
  getDB(dbName: string): Db;
  onModuleInit(): Promise<void>;
  enableShutdownHooks(app: INestApplication): Promise<void>;
}
