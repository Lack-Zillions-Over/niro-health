import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { ChatUser } from '@/mongoose/chat/schemas/chat-users';
import { ChatMessage } from '@/mongoose/chat/schemas/chat-messages';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema({
  collection: 'chat-rooms',
  timestamps: true,
})
export class ChatRoom {
  @Prop({
    required: [true, '{PATH} este campo é obrigatório para sua segurança'],
    trim: true,
    unique: true,
  })
  name: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatUser' }])
  users: ChatUser[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' }])
  messages: ChatMessage[];

  @Prop({
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    default: Date.now,
  })
  updatedAt: Date;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
