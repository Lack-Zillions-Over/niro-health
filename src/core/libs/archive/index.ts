import * as archiver from 'archiver';
import { constants } from 'zlib';
import { Response } from 'express';
import { WriteStream } from 'fs';

import { Archive as Types } from '@/core/libs/archive/types';

export class Archive implements Types.Class {
  base: Types.Class['base'];

  constructor() {
    this.base = archiver('zip', {
      zlib: { level: constants.Z_BEST_COMPRESSION },
    });
  }

  public joinWithReaders(
    stream: WriteStream | Response,
    readers: Types.Reader[],
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const archive = this.base;

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
