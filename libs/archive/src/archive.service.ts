import { Injectable } from '@nestjs/common';

import type { Response } from 'express';
import type { WriteStream } from 'fs';

import * as archiver from 'archiver';
import { constants } from 'zlib';

import { Archive } from '@app/archive/archive.interface';

@Injectable()
export class ArchiveService implements Archive.Class {
  public base: Archive.Class['base'];

  constructor() {
    this.base = archiver('zip', {
      zlib: { level: constants.Z_BEST_COMPRESSION },
    });
  }

  public joinWithReaders(
    stream: WriteStream | Response,
    readers: Archive.Reader[],
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
