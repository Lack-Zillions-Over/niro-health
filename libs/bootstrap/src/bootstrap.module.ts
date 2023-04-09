import { Module } from '@nestjs/common';
import { BootstrapService } from './bootstrap.service';

import { ConfigurationModule } from '@app/configuration';
import { I18nModule } from '@app/i18n';
import { DebugService } from '@app/debug';
import { PrismaService } from '@app/core/prisma/prisma.service';
import { MongoDBService } from '@app/core/mongodb/mongodb.service';

@Module({
  imports: [ConfigurationModule, I18nModule],
  providers: [BootstrapService, DebugService, PrismaService, MongoDBService],
  exports: [BootstrapService],
})
export class BootstrapModule {}
