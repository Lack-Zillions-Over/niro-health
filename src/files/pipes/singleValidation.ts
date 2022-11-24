import { PipeTransform, Injectable } from '@nestjs/common';
import { Readable } from 'stream';

import { FileValidationPipeDto } from '@/files/dto/validationPipe';

import { ProjectOptions } from '@/constants';

@Injectable()
export class FileSingleValidationPipe
  implements PipeTransform<Express.Multer.File, FileValidationPipeDto>
{
  private get _mimetypes() {
    return ProjectOptions.files.single.mimetypes;
  }

  private _hasValidMimeType(mimetype: string): boolean {
    return this._mimetypes.includes(mimetype);
  }

  transform(value: Express.Multer.File) {
    const { mimetype } = value;

    const stream = Readable.from(value.buffer);

    const data = { ...value, stream };

    if (!this._hasValidMimeType(mimetype)) {
      return {
        success: false,
        data,
        mimetypes: this._mimetypes,
      };
    }

    return { success: true, data, mimetypes: this._mimetypes };
  }
}
