import { Module } from '@nestjs/common';

import { CoreService } from '@/core/core.service';
import { CoreController } from '@/core/core.controller';
import { LibsModule } from '@/core/libs/libs.module';
import { UtilsModule } from '@/core/utils/utils.module';
import { ServicesModule } from '@/core/services/services.module';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { MongoDBModule } from '@/core/mongodb/mongodb.module';

@Module({
  imports: [
    LibsModule,
    UtilsModule,
    ServicesModule,
    PrismaModule,
    MongoDBModule,
  ],
  controllers: [CoreController],
  providers: [CoreService],
  exports: [
    CoreService,
    LibsModule,
    UtilsModule,
    ServicesModule,
    PrismaModule,
    MongoDBModule,
  ],
})
export class CoreModule {}
