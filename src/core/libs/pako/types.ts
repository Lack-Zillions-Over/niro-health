export declare namespace Pako {
  export interface Class {
    compress(json: string): Uint8Array;
    decompress(compressed: Uint8Array): string;
  }
}
