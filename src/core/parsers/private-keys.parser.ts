import { Injectable } from '@nestjs/common';
import { PrivateKey } from '../entities/private-keys.entity';

@Injectable()
export class PrivateKeysParser {
  toJSON(key: PrivateKey): Partial<PrivateKey> {
    return {
      id: key.id,
      tag: key.tag,
    };
  }
}
