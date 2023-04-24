import { Injectable } from '@nestjs/common';

import { deflate, inflate } from 'pako';

import type { IBjsonService } from '@app/bjson';

/**
 * @description The module that provides the service to encode and decode objects.
 */
@Injectable()
export class BjsonService implements IBjsonService {
  /**
   * @description The object that contains the constructors.
   */
  static CONSTRUCTORS: Record<string, any> = {};

  /**
   * @description The maximum depth of the object.
   */
  static MAXDEPTH = 100;

  /**
   * @description Encode an object to string.
   * @param value - The value to be encoded.
   * @param depth - The depth of the object.
   */
  private _encode<T>(value: T, depth: number) {
    if (depth >= BjsonService.MAXDEPTH) throw new Error('Object too deep');

    const type = Object.prototype.toString.call(value);

    if (type === '[object Object]' || type === '[object Array]') {
      const constructorName = value.constructor.name;

      if (constructorName !== 'Object' && constructorName !== 'Array') {
        value['@'] = constructorName;
      }

      for (const key of Object.keys(value)) {
        value[key] = this._encode(value[key], depth + 1);
      }
    }

    return value;
  }

  /**
   * @description Decode an object from string.
   * @param value - The value to be decoded.
   */
  private _decode(value: string) {
    const type = Object.prototype.toString.call(value);

    if (type === '[object Object]' || type === '[object Array]') {
      if (value['@']) {
        const constructor = BjsonService.CONSTRUCTORS[value['@']] as {
          prototype;
        };
        if (constructor) {
          Object.setPrototypeOf(value, constructor.prototype);
        }
      }
      for (const key of Object.keys(value)) {
        value[key] = this._decode(value[key]);
      }
    }

    return value;
  }

  /**
   * @description It adds the constructors to the `_constructors` object.
   * @param constructors - The constructors to be added.
   */
  public addConstructors(...constructors: Array<any>) {
    for (const constructor of constructors) {
      const func = constructor as typeof Function;
      BjsonService.CONSTRUCTORS[func.name] = constructor;
    }
  }

  /**
   * @description It removes the constructors from the `_constructors` object.
   * @param constructors - The constructors to be removed.
   */
  public removeConstructors(...constructors: Array<any>) {
    for (const constructor of constructors) {
      const func = constructor as typeof Function;
      if (!BjsonService.CONSTRUCTORS[func.name]) continue;
      delete BjsonService.CONSTRUCTORS[func.name];
    }
  }

  /**
   * @description Sets the maximum depth of the object.
   * @param maxDepth - The maximum depth.
   */
  public setMaxDepth(maxDepth: number) {
    BjsonService.MAXDEPTH = maxDepth;
  }

  /**
   * @description Gets the maximum depth of the object.
   */
  public getMaxDepth(): number {
    return BjsonService.MAXDEPTH;
  }

  /**
   * @description It takes an object of type custom, makes a deep copy of it, and returns it.
   * @param object - The object to be copied.
   */
  public makeDeepCopy<T>(object: T): T {
    return this.parse(this.stringify(object));
  }

  /**
   * @description It takes an object of type custom, encodes it, stringifies it, and returns it.
   * @param value - The value to be encoded.
   */
  public stringify<T>(value: T): Uint8Array {
    return deflate(JSON.stringify(this._encode(value, 0)));
  }

  /**
   * @description It takes a string, parses it, decodes it, and returns it.
   * @param json - The value to be decoded.
   */
  public parse<T>(json: Uint8Array): T {
    return this._decode(JSON.parse(inflate(json, { to: 'string' }))) as T;
  }
}
