import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from '@/mongoose/chat/chat.service';
import { ChatRoom, ChatRoomSchema } from '@/mongoose/chat/schemas/chat-rooms';
import { ChatUser, ChatUserSchema } from '@/mongoose/chat/schemas/chat-users';
import {
  ChatMessage,
  ChatMessageSchema,
} from '@/mongoose/chat/schemas/chat-messages';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
      { name: ChatUser.name, schema: ChatUserSchema },
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
  ],
  providers: [ChatService],
  exports: [ChatService],
})
export class MongooseAppModule {}
