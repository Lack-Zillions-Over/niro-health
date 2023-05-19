import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import type { IPrismaService } from '@app/core/prisma/prisma.interface';

/**
 * @description This service is used to connect to the database using Prisma.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements IPrismaService, OnModuleInit
{
  /**
   * @description This method is used to connect to the database.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * @description This method is used to close the connection to the database.
   */
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
