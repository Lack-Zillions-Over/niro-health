import { Injectable } from '@nestjs/common';
import { constants, Gzip, Gunzip, createGzip, createGunzip } from 'zlib';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { WriteStream } from 'fs-extra';
import { Response } from 'express';
import {
  Db,
  GridFSBucket,
  GridFSBucketReadStream,
  GridFSBucketWriteStream,
  ObjectId,
} from 'mongodb';

import { FileGridfs } from '@app/file-gridfs/file-gridfs.interface';
import { ConfigurationService } from '@app/configuration';
import { MongoDBService } from '@app/core/mongodb/mongodb.service';

@Injectable()
export class FileGridfsService implements FileGridfs.Class {
  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly mongoDBService: MongoDBService,
  ) {}

  private dbName() {
    return this.mongoDBService.getDB(
      this.configurationService.MONGODB_GRIDFS_NAME ||
        this.configurationService.MONGODB_NAME,
    );
  }

  /**
   * @description Open Stream(GridFSBucketWriteStream) for writing data in database.
   * @param stream {ReadStream} - ReadStream (Source)
   * @param metadata {FileGridFSMetadataFileType} - Metadata of file
   */
  public async openUploadStream(
    stream: FileGridfs.ReadStreamType,
    metadata: FileGridfs.FileGridFSMetadataFileType,
  ): FileGridfs.OpenUploadStream {
    try {
      const bucket = new GridFSBucket(this.dbName() as Db),
        streamBucket = bucket.openUploadStream(
          `${String(metadata.filename).trim()}${String(
            metadata.fileext,
          ).trim()}`,
          {
            metadata: {
              authorId: metadata.authorId,
              size: metadata.size,
              version: metadata.version,
              status: metadata.status,
            },
          },
        );

      const pipe = promisify(pipeline);

      try {
        await pipe<FileGridfs.ReadStreamType, Gzip, GridFSBucketWriteStream>(
          stream,
          createGzip({ level: constants.Z_BEST_COMPRESSION }),
          streamBucket,
        );
      } catch (error) {
        return {
          fileId: streamBucket.id,
          version: metadata.version,
          compressedSize: streamBucket.length,
          status: 'Corrupted',
        };
      }

      return {
        fileId: streamBucket.id,
        version: metadata.version,
        compressedSize: streamBucket.length,
        status: metadata.status,
      };
    } catch (error) {
      return new Error(
        error instanceof Error ? error.message : JSON.stringify(error),
      );
    }
  }

  /**
   * @description Open Stream(GridFSBucketReadStream) for reading data in database.
   * @param stream {WriteStream | Response} - WriteStream (Destination)
   * @param fileId {ObjectId} - ObjectId of file
   */
  public async openDownloadStream(
    stream: WriteStream | Response,
    fileId: ObjectId,
    decompress?: boolean,
  ): FileGridfs.OpenDownloadStream {
    try {
      const bucket = new GridFSBucket(this.dbName() as Db),
        streamBucket = bucket.openDownloadStream(fileId);

      if (!decompress) {
        return streamBucket.pipe(stream).on('error', async (error) => {
          throw new Error(
            error instanceof Error ? error.message : JSON.stringify(error),
          );
        });
      } else {
        const pipe = promisify(pipeline);

        return await pipe<
          GridFSBucketReadStream,
          Gunzip,
          WriteStream | Response
        >(
          streamBucket,
          createGunzip({ level: constants.Z_BEST_COMPRESSION }),
          stream,
        );
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : JSON.stringify(error),
      );
    }
  }

  /**
   * @description Return Stream(GridFSBucketReadStream) for reading data in database.
   * @param fileId {ObjectId} - ObjectId of file
   */
  public async getDownloadStream(
    fileId: ObjectId,
  ): FileGridfs.GetDownloadStream {
    try {
      const bucket = new GridFSBucket(this.dbName() as Db),
        streamBucket = bucket.openDownloadStream(fileId);

      return streamBucket;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : JSON.stringify(error),
      );
    }
  }

  /**
   * @description Return version of file in database
   * @param authorId {string} - Id of author
   * @param filename {string} - Name of file
   * @param fileext {string} - Extension of file
   */
  public async getVersion(
    authorId: string,
    filename: string,
    fileext: string,
  ): FileGridfs.GetVersion {
    try {
      const bucket = new GridFSBucket(this.dbName() as Db),
        files = await bucket
          .find({
            filename: `${String(filename).trim()}${String(fileext).trim()}`,
            'metadata.authorId': authorId,
          })
          .toArray();

      if (files.length > 0) {
        const metadata = files[files.length - 1].metadata;

        if (metadata) {
          return metadata['version'];
        } else {
          return 0;
        }
      } else return 0;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : JSON.stringify(error),
      );
    }
  }

  /**
   * @description Rename file in database
   * @param authorId {string} - Id of author
   * @param filename {string} - Name of file
   * @param fileext {string} - Extension of file
   * @param name {String} - New name of file
   */
  public async rename(
    authorId: string,
    filename: string,
    fileext: string,
    name: string,
  ): FileGridfs.Rename {
    try {
      const bucket = new GridFSBucket(this.dbName() as Db),
        files = await bucket
          .find({
            filename: `${String(filename).trim()}${String(fileext).trim()}`,
            'metadata.authorId': authorId,
          })
          .toArray();

      if (files.length <= 0) throw new Error('File not found');

      for await (const file of files) {
        await bucket.rename(file._id, `${String(name).trim()}${fileext}`);
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : JSON.stringify(error),
      );
    }
  }

  /**
   * @description Delete file in database
   * @param authorId {string} - Id of author
   * @param filename {string} - Name of file
   * @param fileext {string} - Extension of file
   * @param version {number} - Version of file
   */
  public async delete(
    authorId: string,
    filename: string,
    fileext: string,
    version: number,
  ): FileGridfs.Delete {
    try {
      const bucket = new GridFSBucket(this.dbName() as Db),
        files = await bucket
          .find({
            filename: `${String(filename).trim()}${String(fileext).trim()}`,
            'metadata.authorId': authorId,
            'metadata.version': version,
          })
          .toArray();

      if (files.length <= 0) throw new Error('File not found');

      for await (const file of files) {
        await bucket.delete(file._id);
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : JSON.stringify(error),
      );
    }
  }
}
