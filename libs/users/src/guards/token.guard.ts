import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';

import { AppHostService } from '@app/app-host';
import { CheckUserSession } from '@app/core/common/functions/CheckUserSession';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private appHostService: AppHostService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const useToken = this.reflector.get<boolean>(
      'useToken',
      context.getHandler(),
    );

    if (!useToken) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const user_id = request.headers['user_id'] as string,
      token_value = request.headers['token_value'] as string,
      token_signature = request.headers['token_signature'] as string,
      token_revalidate_value = request.headers[
        'token_revalidate_value'
      ] as string,
      token_revalidate_signature = request.headers[
        'token_revalidate_signature'
      ] as string;

    return await CheckUserSession(
      {
        user_id,
        token_value,
        token_signature,
        token_revalidate_value,
        token_revalidate_signature,
      },
      this.appHostService.app,
    );
  }
}
