import type { Readable } from 'stream';
import type { ReadStream, WriteStream } from 'fs-extra';
import type { Response } from 'express';
import type { ObjectId, GridFSBucketReadStream } from 'mongodb';

export type ReadStreamType = ReadStream | Readable | Buffer;

export type FileGridFSMetadataFileStatusType =
  | 'Active'
  | 'Inactive'
  | 'Corrupted';

export type FileGridFSMetadataFileType = {
  filename: string;
  fileext: string;
  authorId: string;
  size: string;
  version: number;
  status: FileGridFSMetadataFileStatusType;
};

export type OpenUploadStream = Promise<
  | {
      fileId: ObjectId;
      version: number;
      compressedSize: number;
      status: FileGridFSMetadataFileStatusType;
    }
  | Error
>;
export type OpenDownloadStream = Promise<
  void | WriteStream | Response<any, Record<string, any>>
>;

export type GetDownloadStream = Promise<GridFSBucketReadStream>;

export type GetVersion = Promise<number>;

export type Rename = Promise<void>;

export type Delete = Promise<void>;

export interface IFileGridfsService {
  openUploadStream(
    stream: ReadStreamType,
    metadata: FileGridFSMetadataFileType,
  ): OpenUploadStream;
  openDownloadStream(
    stream: WriteStream | Response,
    fileId: ObjectId,
    decompress?: boolean,
  ): OpenDownloadStream;
  getDownloadStream(fileId: ObjectId): GetDownloadStream;
  getVersion(authorId: string, filename: string, fileext: string): GetVersion;
  rename(
    authorId: string,
    filename: string,
    fileext: string,
    name: string,
  ): Rename;
  delete(
    authorId: string,
    filename: string,
    fileext: string,
    version: number,
  ): Delete;
}
