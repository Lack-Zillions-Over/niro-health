import { Injectable } from '@nestjs/common';
import type { PrivateKey } from '@app/private-keys/entities';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';

@Injectable()
export class PrivateKeysParser {
  toJSON(key: PrivateKey): RecursivePartial<PrivateKey> {
    return {
      id: key.id,
      tag: key.tag,
      value: key.value,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
    };
  }
}
