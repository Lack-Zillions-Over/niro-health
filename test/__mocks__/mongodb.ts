import * as fs from 'fs';
import * as path from 'path';

export class Db {}

export class GridFSBucket {
  openUploadStream() {
    return {
      id: '123456def',
      length: 123456,
    };
  }

  openDownloadStream() {
    return fs.createReadStream(
      path.join(__dirname, '..', '__files__', 'text.txt'),
    );
  }

  find() {
    return {
      toArray: async () => {
        return [
          {
            metadata: {
              version: 1,
            },
          },
        ];
      },
    };
  }

  rename() {
    return Promise.resolve();
  }

  delete() {
    return Promise.resolve();
  }
}

export class GridFSBucketReadStream {}

export class GridFSBucketWriteStream {}

export class ObjectId {}
