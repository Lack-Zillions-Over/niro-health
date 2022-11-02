import { JsonEX as Types } from '@/core/libs/jsonEx/types';
import { Pako } from '@/core/libs/pako/';

export class JsonEx implements Types.Class {
  private readonly pako: Pako;

  constructor(private readonly maxDepth: number = 100) {
    this.pako = new Pako();
  }

  private _encode<T>(value: Types.Value<T | string>, depth: number) {
    if (depth >= this.maxDepth) throw new Error('Object too deep');

    const type = Object.prototype.toString.call(value);

    if (type === '[object Object]' || type === '[object Array]') {
      const constructorName = value.constructor.name;

      if (constructorName !== 'Object' && constructorName !== 'Array') {
        value['@'] = constructorName;
      }

      for (const key of Object.keys(value)) {
        value[key] = this._encode(
          value[key] as unknown as Types.Value<string>,
          depth + 1,
        ) as unknown as string;
      }
    }
    return value;
  }

  private _decode(value: string) {
    const type = Object.prototype.toString.call(value);
    const window = {};
    if (type === '[object Object]' || type === '[object Array]') {
      if (value['@']) {
        const constructor = window[value['@']];
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

  public getMaxDepth(): number {
    return this.maxDepth;
  }

  public makeDeepCopy<T>(object: Types.Value<T>) {
    return this.parse(this.stringify(object));
  }

  public stringify<T>(value: Types.Value<T>) {
    return this.pako.compress(JSON.stringify(this._encode(value, 0)));
  }

  public parse(json: Uint8Array) {
    return this._decode(JSON.parse(this.pako.decompress(json)));
  }
}
