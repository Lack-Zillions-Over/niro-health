import { Global, Module } from '@nestjs/common';
import { MongoDBService } from '@/core/mongodb/mongodb.service';

@Global()
@Module({
  providers: [MongoDBService],
  exports: [MongoDBService],
})
export class MongoDBModule {}
