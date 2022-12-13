import { Module } from '@nestjs/common';

import { CoreModule } from '@/core/core.module';

import { ChatGateway } from '@/websockets/chat/chat.gateway';
import { MongooseAppModule } from '@/mongoose/mongoose.module';

@Module({
  imports: [CoreModule, MongooseAppModule],
  providers: [ChatGateway],
})
export class WebSocketModule {}
