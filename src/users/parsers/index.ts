import { Injectable } from '@nestjs/common';

import { EntityWithRelation } from '@/users/types/entityWithRelation';
import { RecursivePartial } from '@/core/common/types/recursive-partial.type';

@Injectable()
export class UsersParser {
  toJSON(user: EntityWithRelation): RecursivePartial<EntityWithRelation> {
    return {
      id: user.id,
      username: user.username,
      roles: user.roles,
      session: user.session,
      activate: user.activate,
      files: user.files,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
