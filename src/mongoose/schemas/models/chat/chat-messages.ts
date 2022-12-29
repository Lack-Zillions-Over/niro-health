import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { ChatUser } from '@/mongoose/schemas/models/chat/chat-users';

export type ChatMessageDocument = HydratedDocument<ChatMessage>;

@Schema({
  collection: 'chat-messages',
  timestamps: true,
})
export class ChatMessage {
  @Prop({
    required: [true, '{PATH} this field is required'],
    unique: true,
    trim: true,
  })
  cid: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ChatUser' })
  author: ChatUser;

  @Prop({
    required: [true, '{PATH} this field is required'],
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

export const ChatMessageDocument = {
  entity: ChatMessage,
  schema: ChatMessageSchema,
};
