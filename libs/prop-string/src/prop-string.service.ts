import { Injectable } from '@nestjs/common';

import type { IPropStringService } from '@app/prop-string';

@Injectable()
export class PropStringService implements IPropStringService {
  /**
   * @description Get value of property in object by string
   */
  public execute<T, R>(text: string, object: T): R {
    if (text === '') return null;

    if (typeof text !== 'string') return null;

    let value, error;

    for (const [index, key] of text.split('.').entries()) {
      if (index === 0) {
        value = object[key];
      } else {
        if (!value[key]) {
          error = `Prop "${key}" not found in locale."`;
          break;
        }

        value = value[key];
      }
    }

    if (error) return null;

    return value as R;
  }
}
