import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { ChatRoom } from '@/mongoose/schemas/models/chat/chat-rooms';
import { ChatMessage } from '@/mongoose/schemas/models/chat/chat-messages';

export type ChatUserDocument = HydratedDocument<ChatUser>;

@Schema({
  collection: 'chat-users',
  timestamps: true,
})
export class ChatUser {
  @Prop({
    required: [true, '{PATH} this field is required'],
    unique: true,
    trim: true,
  })
  cid: string;

  @Prop({
    required: [true, '{PATH} this field is required'],
    trim: true,
  })
  nickname: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' }])
  rooms: ChatRoom[];

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

export const ChatUserSchema = SchemaFactory.createForClass(ChatUser);

export const ChatUserDocument = {
  entity: ChatUser,
  schema: ChatUserSchema,
};
