import { Injectable } from '@nestjs/common';

import type { Archiver } from 'archiver';
import type { Response } from 'express';
import type { WriteStream } from 'fs';

import * as archiver from 'archiver';
import { constants } from 'zlib';

import type { IArchiveService, Compression, Reader } from '@app/archive';

@Injectable()
export class ArchiveService implements IArchiveService {
  static COMPRESSIONLEVEL: Compression.Level = 'BEST_COMPRESSION';

  private get _zlibCompressionLevel(): Compression.ZLIB_LEVEL {
    return `Z_${ArchiveService.COMPRESSIONLEVEL}`;
  }

  private get _base(): Archiver {
    return archiver('zip', {
      zlib: { level: constants[this._zlibCompressionLevel] },
    });
  }

  public async setCompressionLevel(level: Compression.Level): Promise<void> {
    ArchiveService.COMPRESSIONLEVEL = level;
  }

  public async getCompressionLevel(): Promise<Compression.Level> {
    return Promise.resolve(ArchiveService.COMPRESSIONLEVEL);
  }

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
