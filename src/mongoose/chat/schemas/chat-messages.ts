import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { ChatUser } from '@/mongoose/chat/schemas/chat-users';

export type ChatMessageDocument = HydratedDocument<ChatMessage>;

@Schema({
  collection: 'chat-messages',
  timestamps: true,
})
export class ChatMessage {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ChatUser' })
  author: ChatUser;

  @Prop({
    required: [true, '{PATH} este campo é obrigatório para sua segurança'],
    trim: true,
  })
  body: string;

  @Prop({
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    default: Date.now,
  })
  updatedAt: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
