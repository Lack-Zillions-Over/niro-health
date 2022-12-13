import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';

import { UseGuards } from '@nestjs/common';

import { Server } from 'socket.io';

import { CoreService } from '@/core/core.service';
import { ChatService } from '@/mongoose/chat/chat.service';
import { TokenGuard } from '@/websockets/guards/token.guard';
import { Token } from '@/users/guards/token.decorator';

import WebSocketConstants from '@/websockets/constants';

import { WebSocketsResponse } from '@/core/common/types/websockets-response.type';
import { ChatRoom } from '@/mongoose/chat/schemas/chat-rooms';

import * as _ from 'lodash';

@WebSocketGateway({
  cors: {
    origin: WebSocketConstants.cors.origin,
  },
})
@UseGuards(TokenGuard)
export class ChatGateway {
  constructor(
    private readonly coreService: CoreService,
    private readonly chatService: ChatService,
  ) {}
  @WebSocketServer()
  server: Server;

  @Token(true)
  @SubscribeMessage('rooms:create')
  async identity(
    @MessageBody() name: string,
  ): Promise<WsResponse<WebSocketsResponse<ChatRoom | string>>> {
    try {
      return {
        data: {
          error: false,
          message: 'Room created',
          data: await this.chatService.createRoom(name),
        },
        event: 'rooms:create:response',
      };
    } catch (error) {
      return {
        data: {
          error: true,
          message: 'Room not created',
          data: _(error).toString(),
        },
        event: 'rooms:create:response',
      };
    }
  }
}
