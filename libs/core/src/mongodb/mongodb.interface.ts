import type { INestApplication } from '@nestjs/common';
import type { Db } from 'mongoose/lib';

export interface IMongoDBService {
  getDB(dbName: string): Db;
  onModuleInit(): Promise<void>;
  enableShutdownHooks(app: INestApplication): Promise<void>;
}
