import type { INestApplication } from '@nestjs/common';

export interface IPrismaService {
  onModuleInit(): Promise<void>;
  enableShutdownHooks(app: INestApplication): Promise<void>;
}
