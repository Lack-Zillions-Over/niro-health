import { MessageBody, SubscribeMessage } from '@nestjs/websockets';

import { ContractGateway } from '@/websockets/contracts/contract.gateway';

import { CoreService } from '@/core/core.service';
import { ChatService } from '@/mongoose/services/chat.service';
import { Token } from '@/users/guards/token.decorator';

import { ChatEvents } from '@/websockets/chat/chat.events';

export class ChatGateway extends ContractGateway {
  constructor(
    protected readonly coreService: CoreService,
    protected readonly chatService: ChatService,
  ) {
    super(coreService, chatService);
  }

  @Token(true)
  @SubscribeMessage(ChatEvents.Create)
  async roomCreate(@MessageBody() name: string) {
    const eventResponse = `${ChatEvents.Create}:response`;

    return await this.handleMessageResponse(
      async () => await this.chatService.create(name),
      {
        success: {
          message: 'Room created',
          event: eventResponse,
        },
        error: {
          message: 'Room not created',
          event: eventResponse,
        },
      },
    );
  }

  @Token(true)
  @SubscribeMessage(ChatEvents.Rename)
  async roomRename(@MessageBody() query: { id: string; name: string }) {
    const eventResponse = `${ChatEvents.Rename}:response`;

    return await this.handleMessageResponseAllSockets(
      async () => await this.chatService.rename(query.id, query.name),
      {
        success: {
          message: 'Room renamed',
          event: eventResponse,
        },
        error: {
          message: 'Room not renamed',
          event: eventResponse,
        },
      },
    );
  }

  @Token(true)
  @SubscribeMessage(ChatEvents.Delete)
  async roomDelete(@MessageBody() _id: string) {
    const eventResponse = `${ChatEvents.Delete}:response`;

    return await this.handleMessageResponse(
      async () => ((await this.chatService.deleteRoom(_id)) ? _id : false),
      {
        success: {
          message: 'Room deleted',
          event: eventResponse,
        },
        error: {
          message: 'Room not deleted',
          event: eventResponse,
        },
      },
    );
  }

  @Token(true)
  @SubscribeMessage(ChatEvents.FindAll)
  async roomFindAll() {
    const eventResponse = `${ChatEvents.FindAll}:response`;

    return await this.handleMessageResponse(
      async () => await this.chatService.findAll(),
      {
        success: {
          message: 'Found all rooms',
          event: eventResponse,
        },
        error: {
          message: 'Rooms not found',
          event: eventResponse,
        },
      },
    );
  }

  @Token(true)
  @SubscribeMessage(ChatEvents.AppendUser)
  async appendUser(@MessageBody() query: { id: string; userId: string }) {
    const eventResponse = `${ChatEvents.AppendUser}:response`;

    return await this.handleMessageResponseAllSockets(
      async () => await this.chatService.appendUser(query.id, query.userId),
      {
        success: {
          message: 'Append user to room',
          event: eventResponse,
        },
        error: {
          message: 'User not appended to room',
          event: eventResponse,
        },
      },
    );
  }

  @Token(true)
  @SubscribeMessage(ChatEvents.RemoveUser)
  async removeUser(@MessageBody() query: { id: string; userId: string }) {
    return await this.handleMessageResponseAllSockets(
      async () => await this.chatService.removeUser(query.id, query.userId),
      {
        success: {
          message: 'Remove user from room',
          event: `${ChatEvents.RemoveUser}:response`,
        },
        error: {
          message: 'Rooms not found',
          event: `${ChatEvents.RemoveUser}:response`,
        },
      },
    );
  }

  @Token(true)
  @SubscribeMessage(ChatEvents.AppendMessage)
  async appendMessage(@MessageBody() query: { id: string; messageId: string }) {
    const eventResponse = `${ChatEvents.AppendMessage}:response`;

    return await this.handleMessageResponseAllSockets(
      async () =>
        await this.chatService.appendMessage(query.id, query.messageId),
      {
        success: {
          message: 'Append message to room',
          event: eventResponse,
        },
        error: {
          message: 'Message not appended to room',
          event: eventResponse,
        },
      },
    );
  }

  @Token(true)
  @SubscribeMessage(ChatEvents.RemoveMessage)
  async removeMessage(@MessageBody() query: { id: string; messageId: string }) {
    const eventResponse = `${ChatEvents.RemoveMessage}:response`;

    return await this.handleMessageResponseAllSockets(
      async () =>
        await this.chatService.removeMessage(query.id, query.messageId),
      {
        success: {
          message: 'Append message to room',
          event: eventResponse,
        },
        error: {
          message: 'Message not appended to room',
          event: eventResponse,
        },
      },
    );
  }
}
