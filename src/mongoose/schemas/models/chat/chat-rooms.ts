import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { ChatUser } from '@/mongoose/schemas/models/chat/chat-users';
import { ChatMessage } from '@/mongoose/schemas/models/chat/chat-messages';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema({
  collection: 'chat-rooms',
  timestamps: true,
})
export class ChatRoom {
  @Prop({
    required: [true, '{PATH} this field is required'],
    unique: true,
    trim: true,
  })
  cid: string;

  @Prop({
    required: [true, '{PATH} this field is required'],
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

export const ChatRoomDocument = {
  entity: ChatRoom,
  schema: ChatRoomSchema,
};
