import ChatRoomSchema from '@/schemas/chat/rooms';
import ChatUserSchema from '@/schemas/chat/users';

declare interface ChatMessageSchema {
  _id: string;
  cid: string;
  room: ChatRoomSchema;
  author: ChatUserSchema;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export default ChatMessageSchema;
