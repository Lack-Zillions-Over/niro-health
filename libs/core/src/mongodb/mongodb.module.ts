import { Global, Module } from '@nestjs/common';
import { MongoDBService } from '@app/core/mongodb/mongodb.service';

import { ConfigurationService } from '@app/configuration';
import { DebugService } from '@app/debug';

@Global()
@Module({
  providers: [MongoDBService, ConfigurationService, DebugService],
  exports: [MongoDBService],
})
export class MongoDBModule {}
