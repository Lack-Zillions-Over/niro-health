import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';

import { FindByIdUserFactory } from '@/users/factories/findById';

import { PrismaService } from '@/core/prisma/prisma.service';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prismaService: PrismaService,
    private readonly libsService: LibsService,
    private readonly utilsService: UtilsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const id = request.headers['user_id'] as string;

    const user = await FindByIdUserFactory.run(
      id,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );

    if (user instanceof Error) return false;

    return roles.find((role) => user.roles.includes(role)) ? true : false;
  }
}
