import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomDocument } from '@/mongoose/chat/schemas/chat-rooms';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoom.name)
    private chatRoomDocument: Model<ChatRoomDocument>,
  ) {}

  async createRoom(name: string): Promise<ChatRoom> {
    const createdCat = new this.chatRoomDocument({
      name,
    });
    return createdCat.save();
  }

  async findAll(): Promise<ChatRoom[]> {
    return this.chatRoomDocument.find().exec();
  }
}
