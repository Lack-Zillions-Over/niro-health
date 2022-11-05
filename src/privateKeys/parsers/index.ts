import { Injectable } from '@nestjs/common';
import { PrivateKey } from '@/privateKeys/entities';

@Injectable()
export class PrivateKeysParser {
  toJSON(key: PrivateKey): Partial<PrivateKey> {
    return {
      id: key.id,
      tag: key.tag,
      value: key.value,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
    };
  }
}
