import { Injectable } from '@nestjs/common';

import { EntityWithRelation } from '@/files/types/entityWithRelation';
import { RecursivePartial } from '@/core/common/types/recursive-partial.type';

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
      expiredAt: file.expiredAt,
      meta: file.meta,
      author: file.author,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  }
}
