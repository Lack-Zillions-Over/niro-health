import { Injectable } from '@nestjs/common';

import { User } from '@/users/entities';
import { RecursivePartial } from '@/core/common/types/recursive-partial.type';

@Injectable()
export class UsersParser {
  toJSON(user: User): RecursivePartial<User> {
    return {
      id: user.id,
      username: user.username,
      roles: user.roles,
      session: user.session
        ? {
            geoip: user.session.geoip,
            history: user.session.history,
            allowedDevices: user.session.allowedDevices,
            activeClients: user.session.activeClients,
            limitClients: user.session.limitClients,
            banned: user.session.banned,
          }
        : {},
      activate: user.activate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
