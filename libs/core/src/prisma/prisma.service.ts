import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import type { IPrismaService } from '@app/core/prisma/prisma.interface';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements IPrismaService, OnModuleInit
{
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
