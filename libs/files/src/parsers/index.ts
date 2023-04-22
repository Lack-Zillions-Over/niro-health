import { Injectable } from '@nestjs/common';

import { EntityWithRelation } from '@app/files/types/entityWithRelation';
import { RecursivePartial } from '@app/core/common/types/recursive-partial.type';

@Injectable()
export class FilesParser {
  toJSON(file: EntityWithRelation): RecursivePartial<EntityWithRelation> {
    return {
      id: file.id,
      authorId: file.authorId,
      name: file.name,
      mimetype: file.mimetype,
      description: file.description,
      size: file.size,
      compressedSize: file.compressedSize,
      version: file.version,
      tags: file.tags,
      temporary: file.temporary,
      meta: file.meta,
      author: {
        id: file.author.id,
        username: file.author.username,
      },
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      expiredAt: file.expiredAt,
      deletedAt: file.deletedAt,
    };
  }
}
