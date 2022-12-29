import { ChatMessageDocument } from '@/mongoose/schemas/models/chat/chat-messages';
import { ChatRoomDocument } from '@/mongoose/schemas/models/chat/chat-rooms';
import { ChatUserDocument } from '@/mongoose/schemas/models/chat/chat-users';

export default [ChatMessageDocument, ChatRoomDocument, ChatUserDocument];
