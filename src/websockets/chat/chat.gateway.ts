import { MessageBody, SubscribeMessage, WsResponse } from '@nestjs/websockets';

import { ContractGateway } from '@/websockets/contracts/contract.gateway';

import { CoreService } from '@/core/core.service';
import { ChatService } from '@/mongoose/services/chat.service';
import { Token } from '@/users/guards/token.decorator';

import { WebSocketsResponse } from '@/core/common/types/websockets-response.type';
import { ChatRoom } from '@/mongoose/schemas/models/chat/chat-rooms';

export class ChatGateway extends ContractGateway {
  constructor(
    protected readonly coreService: CoreService,
    protected readonly chatService: ChatService,
  ) {
    super(coreService, chatService);
  }

  @Token(true)
  @SubscribeMessage('rooms:create')
  async roomCreate(
    @MessageBody() name: string,
  ): Promise<WsResponse<WebSocketsResponse<ChatRoom | string>>> {
    return await this.handleMessageResponse(
      async () => await this.chatService.create(name),
      {
        success: {
          message: 'Room created',
          event: 'rooms:create:response',
        },
        error: {
          message: 'Room not created',
          event: 'rooms:create:response',
        },
      },
    );
  }

  @Token(true)
  @SubscribeMessage('rooms:rename')
  async roomRename(@MessageBody() query: { id: string; name: string }) {
    return await this.handleMessageResponseAllSockets(
      async () => await this.chatService.rename(query.id, query.name),
      {
        success: {
          message: 'Room renamed',
          event: 'rooms:renamed:response',
        },
        error: {
          message: 'Room not renamed',
          event: 'rooms:renamed:response',
        },
      },
    );
  }

  @Token(true)
  @SubscribeMessage('rooms:findAll')
  async roomFindAll(): Promise<
    WsResponse<WebSocketsResponse<ChatRoom[] | string>>
  > {
    return await this.handleMessageResponse(
      async () => await this.chatService.findAll(),
      {
        success: {
          message: 'Found all rooms',
          event: 'rooms:findAll:response',
        },
        error: {
          message: 'Rooms not found',
          event: 'rooms:findAll:response',
        },
      },
    );
  }

  @Token(true)
  @SubscribeMessage('rooms:delete')
  async roomDelete(
    @MessageBody() _id: string,
  ): Promise<WsResponse<WebSocketsResponse<boolean | string>>> {
    return await this.handleMessageResponse(
      async () => ((await this.chatService.deleteRoom(_id)) ? _id : false),
      {
        success: {
          message: 'Room deleted',
          event: 'rooms:delete:response',
        },
        error: {
          message: 'Room not deleted',
          event: 'rooms:delete:response',
        },
      },
    );
  }
}
