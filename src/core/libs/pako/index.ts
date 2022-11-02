import { deflate, inflate } from 'pako';

import { Pako as Types } from '@/core/libs/pako/types';

export class Pako implements Types.Class {
  public compress(json: string) {
    return deflate(json);
  }

  public decompress(compressed: Uint8Array) {
    return inflate(compressed, { to: 'string' });
  }
}
