import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CoreService } from '@/core/core.service';

import {
  ChatRoom,
  ChatRoomDocument,
} from '@/mongoose/schemas/models/chat/chat-rooms';

import {
  ChatUser,
  ChatUserDocument,
} from '@/mongoose/schemas/models/chat/chat-users';

import {
  ChatMessage,
  ChatMessageDocument,
} from '@/mongoose/schemas/models/chat/chat-messages';

@Injectable()
export class ChatService {
  constructor(
    protected readonly coreService: CoreService,
    @InjectModel(ChatRoom.name)
    private chatRoomDocument: Model<ChatRoomDocument>,
    @InjectModel(ChatUser.name)
    private chatUserDocument: Model<ChatUserDocument>,
    @InjectModel(ChatMessage.name)
    private chatMessageDocument: Model<ChatMessageDocument>,
  ) {}

  private get _cid() {
    return this.coreService.utilsService.random().uuid();
  }

  private async _verifyRoomAndUserExist(roomId: string, userId: string) {
    const room = await this.chatRoomDocument.findById(roomId);
    const user = await this.chatUserDocument.findById(userId);

    if (!room || !user)
      return {
        room: null,
        user: null,
      };

    return { room, user };
  }

  private async _verifyRoomAndUserAndMessageExist(
    roomId: string,
    userId: string,
    messageId: string,
  ) {
    const room = await this.chatRoomDocument.findById(roomId);
    const user = await this.chatUserDocument.findById(userId);
    const message = await this.chatMessageDocument.findById(messageId);

    if (!room || !user || !message)
      return {
        room: null,
        user: null,
        message: null,
      };

    return { room, user, message };
  }

  async create(name: string): Promise<ChatRoom> {
    const room = new this.chatRoomDocument({
      cid: this._cid,
      name,
    });

    return await room.save();
  }

  async rename(id: string, name: string): Promise<boolean> {
    const room = await this.chatRoomDocument.findById(id);

    if (!room) return false;

    room.name = name;
    await room.save();
    return true;
  }

  async deleteRoom(_id: string): Promise<boolean> {
    const result = await this.chatRoomDocument.deleteOne({ _id });
    return result.acknowledged && result.deletedCount > 0;
  }

  async findAll(): Promise<ChatRoom[]> {
    return this.chatRoomDocument.find().exec();
  }

  async appendUser(id: string, userId: string): Promise<boolean> {
    const { room, user } = await this._verifyRoomAndUserExist(id, userId);

    if (!room || !user) return false;

    if (room.users.filter((_user) => _user.cid == _user.cid).length < 0) {
      room.users.push(user);
      await room.save();
      return true;
    }

    return false;
  }

  async removeUser(id: string, userId: string): Promise<boolean> {
    const { room, user } = await this._verifyRoomAndUserExist(id, userId);

    if (!room || !user) return false;

    const index = room.users.findIndex((_user) => _user.cid == _user.cid);

    if (index > -1) {
      room.users.splice(index, 1);
      await room.save();
      return true;
    }

    return false;
  }

  async appendMessage(
    id: string,
    userId: string,
    messageId: string,
  ): Promise<boolean> {
    const { room, user, message } =
      await this._verifyRoomAndUserAndMessageExist(id, userId, messageId);

    if (!room || !user || !message) return false;

    if (
      room.messages.filter((_message) => _message.cid == _message.cid).length <
      0
    ) {
      room.messages.push(message);
      await room.save();
      return true;
    }

    return false;
  }

  async removeMessage(
    id: string,
    userId: string,
    messageId: string,
  ): Promise<boolean> {
    const { room, user, message } =
      await this._verifyRoomAndUserAndMessageExist(id, userId, messageId);

    if (!room || !user || !message) return false;

    const index = room.messages.findIndex(
      (_message) => _message.cid == _message.cid,
    );

    if (index > -1) {
      room.messages.splice(index, 1);
      await room.save();
      return true;
    }

    return false;
  }
}
