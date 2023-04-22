import { PipeTransform, Injectable } from '@nestjs/common';
import { Readable } from 'stream';

import { AppHostService } from '@app/app-host';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { FileValidationPipeDto } from '@app/files/dto/validationPipe';

@Injectable()
export class FileSingleValidationPipe
  implements PipeTransform<Express.Multer.File, FileValidationPipeDto>
{
  constructor(private readonly appHostSerivce: AppHostService) {}

  private get _mimetypes() {
    return this.appHostSerivce.app
      .get<ConfigurationService>('IConfigurationService')
      .getVariable<string[]>('files_single_mimetypes');
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
