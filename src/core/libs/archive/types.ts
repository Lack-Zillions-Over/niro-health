import type { Archiver } from 'archiver';
import { ReadStream, WriteStream } from 'fs-extra';
import { Response } from 'express';
import { GridFSBucketReadStream } from 'mongodb';
import { Readable } from 'stream';

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
