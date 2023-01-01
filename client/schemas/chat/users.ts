import ChatRoomSchema from '@/schemas/chat/rooms';
import ChatMessageSchema from '@/schemas/chat/messages';

declare interface ChatUserSchema {
  _id: string;
  cid: string;
  nickname: string;
  rooms: ChatRoomSchema[];
  messsages: ChatMessageSchema[];
  createdAt: string;
  updatedAt: string;
}

export default ChatUserSchema;
