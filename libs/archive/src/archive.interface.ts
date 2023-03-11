import type { Archiver } from 'archiver';
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

  export interface Class {
    base: Archiver;
    joinWithReaders(
      stream: WriteStream | Response,
      readers: Reader[],
    ): Promise<void>;
  }
}
