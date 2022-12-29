import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { UseGuards } from '@nestjs/common';

import { Server } from 'socket.io';

import { CoreService } from '@/core/core.service';
import { ChatService } from '@/mongoose/services/chat.service';
import { TokenGuard } from '@/websockets/guards/token.guard';

import WebSocketConstants from '@/websockets/constants';

import * as _ from 'lodash';

declare interface WebSocketsResponseTexts {
  message: string;
  event: string;
}

declare interface WebSocketsResponse {
  success: WebSocketsResponseTexts;
  error: WebSocketsResponseTexts;
}

@WebSocketGateway({
  cors: {
    origin: WebSocketConstants.cors.origin,
  },
})
@UseGuards(TokenGuard)
export class ContractGateway {
  constructor(
    protected readonly coreService: CoreService,
    protected readonly chatService: ChatService,
  ) {}
  @WebSocketServer()
  protected server: Server;

  private _successResponseParser<T>(data: T, message: string, event: string) {
    return {
      data: {
        error: false,
        message,
        data,
      },
      event,
    };
  }

  private _errorResponseParser<T>(error: T, message: string, event: string) {
    return {
      data: {
        message,
        error: true,
        data: _(error).toString(),
      },
      event,
    };
  }

  protected async handleMessageResponse<T>(
    handler: () => Promise<T>,
    response: WebSocketsResponse,
  ) {
    try {
      return this._successResponseParser(
        await handler(),
        response.success.message,
        response.success.event,
      );
    } catch (error) {
      return this._errorResponseParser(
        error,
        response.error.message,
        response.error.event,
      );
    }
  }

  protected async handleMessageResponseAllSockets<T>(
    handler: () => Promise<T>,
    response: WebSocketsResponse,
  ) {
    try {
      return this.server.emit(response.success.event, {
        data: {
          error: false,
          message: response.success.message,
          data: await handler(),
        },
      });
    } catch (error) {
      return this._errorResponseParser(
        error,
        response.error.message,
        response.error.event,
      );
    }
  }
}
