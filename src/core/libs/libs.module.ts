import { Module } from '@nestjs/common';
import { LibsService } from '@/core/libs/libs.service';
import { MongoDBModule } from '@/core/mongodb/mongodb.module';

@Module({
  imports: [MongoDBModule],
  providers: [LibsService],
  exports: [LibsService],
})
export class LibsModule {}
