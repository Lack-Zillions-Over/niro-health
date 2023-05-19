import { PipeTransform, Injectable, Inject } from '@nestjs/common';
import { Readable } from 'stream';

import type { IAppHostService } from '@app/app-host';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { FileValidationPipeDto } from '@app/files/dto/validationPipe';

@Injectable()
export class FileMultipleValidationPipe
  implements PipeTransform<Express.Multer.File[], FileValidationPipeDto[]>
{
  constructor(
    @Inject('IAppHostService')
    private readonly appHostSerivce: IAppHostService,
  ) {}

  private get _mimetypes() {
    return this.appHostSerivce.app
      .get<ConfigurationService>('IConfigurationService')
      .getVariable<string[]>('files_multiple_mimetypes');
  }

  private _hasValidMimeType(mimetype: string): boolean {
    return this._mimetypes.includes(mimetype);
  }

  transform(value: Express.Multer.File[]) {
    return value.map((file) => {
      const { mimetype } = file;

      const stream = Readable.from(file.buffer);

      const data = { ...file, stream };

      if (!this._hasValidMimeType(mimetype)) {
        return {
          success: false,
          data,
          mimetypes: this._mimetypes,
        };
      }

      return { success: true, data, mimetypes: this._mimetypes };
    });
  }
}
