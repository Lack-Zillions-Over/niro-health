import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { AppHostService } from '@app/app-host';
import { FindByIdUserFactory } from '@app/users/factories/findById';
import { User } from '@app/users/entities';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private appHostService: AppHostService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const id = request.headers['user_id'] as string;

    const data = await FindByIdUserFactory.run(id, this.appHostService.app);

    if (data instanceof Error) return false;

    const user = new User(data);

    return roles.find((role) => user.roles.includes(role)) ? true : false;
  }
}
