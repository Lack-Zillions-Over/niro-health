import { Injectable } from '@nestjs/common';

import type { Archiver } from 'archiver';
import type { Response } from 'express';
import type { WriteStream } from 'fs';

import type { IArchiveService, Compression, Reader } from '@app/archive';

import * as archiver from 'archiver';
import { constants } from 'zlib';

/**
 * @description The module responsible for create a zip file with the files.
 */
@Injectable()
export class ArchiveService implements IArchiveService {
  /**
   * @description The compression level used to create the zip file.
   */
  static COMPRESSIONLEVEL: Compression.Level = 'BEST_COMPRESSION';

  /**
   * @description Returns the zlib compression level based on the compression level.
   */
  private get _zlibCompressionLevel(): Compression.ZLIB_LEVEL {
    return `Z_${ArchiveService.COMPRESSIONLEVEL}`;
  }

  /**
   * @description Returns the instance of the archiver.
   */
  private get _base(): Archiver {
    return archiver('zip', {
      zlib: { level: constants[this._zlibCompressionLevel] },
    });
  }

  /**
   * @description Set the compression level used to create the zip file.
   * @param level The compression level. Default: BEST_COMPRESSION
   */
  public async setCompressionLevel(level: Compression.Level): Promise<void> {
    ArchiveService.COMPRESSIONLEVEL = level;
  }

  /**
   * @description Get the compression level used to create the zip file.
   */
  public async getCompressionLevel(): Promise<Compression.Level> {
    return Promise.resolve(ArchiveService.COMPRESSIONLEVEL);
  }

  /**
   * @description Join the files with the zip file.
   * @param stream The stream to write the zip file.
   * @param readers The readers to join with the zip file.
   */
  public async joinWithReaders(
    stream: WriteStream | Response,
    readers: Reader[],
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const archive = this._base;

      stream.on('close', function () {
        return resolve();
      });

      stream.on('end', function () {
        return resolve();
      });

      archive.on('warning', function (error) {
        return reject(error);
      });

      archive.on('error', function (error) {
        return reject(error);
      });

      archive.pipe(stream);

      for (const reader of readers) {
        archive.append(reader.stream, {
          name: reader.filename,
          prefix: `version_${reader.version}`,
        });
      }

      archive.finalize();
    });
  }
}
