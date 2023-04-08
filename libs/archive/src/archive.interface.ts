import type { ReadStream, WriteStream } from 'fs';
import type { Readable } from 'stream';
import type { Response } from 'express';
import type { GridFSBucketReadStream } from 'mongodb';

export declare namespace Archive {
  export interface Reader {
    stream: ReadStream | Readable | GridFSBucketReadStream;
    filename: string;
    version: string;
  }

  export namespace Compression {
    export type Level =
      | 'NO_COMPRESSION'
      | 'BEST_SPEED'
      | 'BEST_COMPRESSION'
      | 'DEFAULT_COMPRESSION';

    export type ZLIB_LEVEL = `Z_${Level}`;
  }

  export interface Class {
    setCompressionLevel(level: Compression.Level): Promise<void>;
    getCompressionLevel(): Promise<Compression.Level>;
    joinWithReaders(
      stream: WriteStream | Response,
      readers: Reader[],
    ): Promise<void>;
  }
}
