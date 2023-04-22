import { Injectable } from '@nestjs/common';
import type { EntityWithRelation } from '@app/users/types/entityWithRelation';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';

@Injectable()
export class UsersParser {
  toJSON(user: EntityWithRelation): RecursivePartial<EntityWithRelation> {
    return {
      id: user.id,
      username: user.username,
      roles: user.roles,
      session: user.session,
      activate: user.activate,
      files: user.files?.map((file) => ({
        id: file.id,
        name: file.name,
        mimetype: file.mimetype,
        description: file.description,
        size: file.size,
        compressedSize: file.compressedSize,
        version: file.version,
        tags: file.tags,
        temporary: file.temporary,
        expiredAt: file.expiredAt,
      })),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
