import ChatUserSchema from '@/schemas/chat/users';
import ChatMessageSchema from '@/schemas/chat/messages';

declare interface ChatRoomSchema {
  _id: string;
  cid: string;
  name: string;
  users: ChatUserSchema[];
  messages: ChatMessageSchema[];
  createdAt: string;
  updatedAt: string;
}

export default ChatRoomSchema;
