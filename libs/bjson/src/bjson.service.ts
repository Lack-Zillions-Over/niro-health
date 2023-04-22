import { Injectable } from '@nestjs/common';

import { deflate, inflate } from 'pako';

import type { IBjsonService } from '@app/bjson';

@Injectable()
export class BjsonService implements IBjsonService {
  static CONSTRUCTORS: Record<string, any> = {};
  static MAXDEPTH = 100;

  /**
   * It takes an object, and if it's an object or an array, it adds a property to
   * it called `@` that contains the name of the constructor
   * @param {T} value - The value to encode.
   * @param {number} depth - The current depth of the object.
   * @returns The value of the object.
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
   * It takes a value, checks if it's an object or an array, and if it is, it
   * checks if it has a special property called @, and if it does, it uses that
   * property to find a constructor function, and if it finds one, it sets the
   * prototype of the value to the prototype of the constructor function
   * @param {string} value - The value to be decoded.
   * @returns The value of the key in the object.
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
   * It takes an array of constructors and adds them to the `_constructors` object
   * @param constructors - Array<unknown>
   */
  public addConstructors(...constructors: Array<unknown>) {
    for (const constructor of constructors) {
      const func = constructor as typeof Function;
      BjsonService.CONSTRUCTORS[func.name] = constructor;
    }
  }

  /**
   * It removes the constructors from the `_constructors` object
   * @param constructors - Array<unknown>
   */
  public removeConstructors(...constructors: Array<unknown>) {
    for (const constructor of constructors) {
      const func = constructor as typeof Function;
      if (!BjsonService.CONSTRUCTORS[func.name]) continue;
      delete BjsonService.CONSTRUCTORS[func.name];
    }
  }

  /**
   * It sets the maxDepth property of the class to the value of the maxDepth
   * parameter.
   * @param {number} maxDepth - The maximum depth of the tree.
   */
  public setMaxDepth(maxDepth: number) {
    BjsonService.MAXDEPTH = maxDepth;
  }

  /**
   * This function returns the maximum depth of the tree.
   * @returns The maxDepth property of the BinarySearchTree class.
   */
  public getMaxDepth(): number {
    return BjsonService.MAXDEPTH;
  }

  /**
   * It takes an object and returns a deep copy of that object
   * @param {T} object - The object to be copied.
   * @returns The object that was passed in.
   */
  public makeDeepCopy<T>(object: T): T {
    return this.parse(this.stringify(object));
  }

  /**
   * It takes a value of type T, encodes it, stringifies it, and deflates it
   * @param {T} value - The value to be encoded.
   * @returns A Uint8Array
   */
  public stringify<T>(value: T): Uint8Array {
    return deflate(JSON.stringify(this._encode(value, 0)));
  }

  /**
   * It takes a JSON string, inflates it, parses it, and then decodes it
   * @param {Uint8Array} json - Uint8Array - The JSON data to parse.
   * @returns The decoded JSON object.
   */
  public parse<T>(json: Uint8Array): T {
    return this._decode(JSON.parse(inflate(json, { to: 'string' }))) as T;
  }
}
