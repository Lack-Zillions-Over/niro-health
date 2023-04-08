import { Injectable } from '@nestjs/common';

import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs-extra';

import { LocalPath } from '@app/localpath/localpath.interface';

@Injectable()
export class LocalPathService implements LocalPath.Class {
  /**
   * @description Return the local path of the file or folder
   */
  public local(p: string): string {
    if (p.substring(0, 1) === '/') p = p.substring(1);

    const base = dirname(String(__dirname)).replace('libs/localpath', '');

    return join(base, p);
  }

  /**
   * @description Verify if the local path exists
   */
  public localExists(p: string): boolean {
    let i = 0,
      path = false,
      pathString = '';

    const paths = [],
      length = p.length;

    for (; i < length; i++) {
      const letter = String(p[i]);

      if (letter != '/') {
        pathString += letter;
      }
      if (letter == '/' || i == length - 1) {
        paths.push(pathString);

        const pathsJoin = paths.join('/');

        if (existsSync(this.local(pathsJoin))) {
          path = true;
        } else {
          path = false;
        }

        pathString = '';
      }
    }

    return path;
  }

  /**
   * @description Create the local path
   */
  public localCreate(p: string): void {
    let dir = '';

    p.split('/').map((path) => {
      if (path.indexOf('.') == -1) {
        if (!this.localExists((dir += `${path}/`))) {
          mkdirSync(this.local(dir));
        }
      }
    });
  }
}
