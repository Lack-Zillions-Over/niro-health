import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CoreModule } from '@/core/core.module';

import { ChatService } from '@/mongoose/services/chat.service';

import models from '@/mongoose/schemas';

@Module({
  imports: [MongooseModule.forFeature(models), CoreModule],
  providers: [ChatService],
  exports: [ChatService],
})
export class MongooseAppModule {}
