export declare namespace Bjson {
  export interface Class {
    addConstructors(...constructors: Array<typeof Function>): void;
    removeConstructors(...names: string[]): void;
    setMaxDepth(maxDepth: number): void;
    getMaxDepth(): number;
    makeDeepCopy<T>(object: T): T;
    stringify<T>(value: T): Uint8Array;
    parse<T>(json: Uint8Array): T;
  }
}
