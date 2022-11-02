export declare namespace JsonEX {
  export type Value<T> = { [x: string]: T };

  export interface Class {
    getMaxDepth(): number;
    makeDeepCopy<T>(object: Value<T>): string;
    stringify<T>(value: Value<T>): Uint8Array;
    parse(json: Uint8Array): string;
  }
}
