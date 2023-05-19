import {
  Controller,
  HttpException,
  HttpStatus,
  Headers,
  Query,
  Res,
  Post,
  Get,
  Delete,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Inject,
} from '@nestjs/common';

import { ObjectId } from 'mongodb';
import { Response } from 'express';
import { Readable } from 'stream';

import * as fs from 'fs-extra';
import * as _ from 'lodash';

import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express/multer';

import type { Reader } from '@app/archive/archive.interface';

import { FileSingleValidationPipe } from '@app/files/pipes/singleValidation';
import { FileMultipleValidationPipe } from '@app/files/pipes/multipleValidation';
import { FileValidationPipeDto } from '@app/files/dto/validationPipe';

import { ConfigurationService } from '@app/configuration';
import { IAppHostService } from '@app/app-host';
import { i18nService } from '@app/i18n';
import { StringExService } from '@app/string-ex';
import { LocalPathService } from '@app/localpath';
import { AwsS3Service } from '@app/aws-s3';
import { ArchiveService } from '@app/archive';
import { FileGridfsService } from '@app/file-gridfs';

import { FilesService } from '@app/files';
import { FilesParser } from '@app/files/parsers';

@Controller('api/files')
export class FilesController {
  private readonly _buckets: {
    single: string;
    multiple: string;
  };

  constructor(
    @Inject('IAppHostService')
    private readonly appHostService: IAppHostService,
    @Inject('IFilesService') private readonly filesService: FilesService,
    @Inject('IFilesParser') private readonly filesParser: FilesParser,
  ) {}

  private get _filesPath(): string {
    return this.appHostService.app
      .get<ConfigurationService>('IConfigurationService')
      .getVariable<string>('files_path');
  }

  private get _awsEncryptAlgorithm(): string {
    return 'AES256';
  }

  private async _handleHttpExceptionFileNotSuccess(
    file: FileValidationPipeDto,
  ) {
    return new HttpException(
      await this.appHostService.app
        .get<i18nService>('Ii18nService')
        .translate(
          'files.controller.file_not_supported',
          file.mimetypes.join(' | '),
        ),
      HttpStatus.EXPECTATION_FAILED,
    );
  }

  private _handleHttpExceptionWithMessage(message: string) {
    return new HttpException(message, HttpStatus.EXPECTATION_FAILED);
  }

  private _headersIsInvalid(headers) {
    const { author_id, description, temporary, tags } = headers;

    return (
      _.isEmpty(author_id) ||
      _.isEmpty(description) ||
      _.isEmpty(temporary) ||
      _.isEmpty(tags)
    );
  }

  private _isDecompress(decompress: string) {
    return decompress === 'true' ? true : false;
  }

  private _createUploadFolder() {
    if (
      !this._filesPath ||
      typeof this._filesPath !== 'string' ||
      this._filesPath.length <= 0
    )
      return false;

    this.appHostService.app
      .get<LocalPathService>('ILocalPathService')
      .localCreate(this._filesPath);

    return true;
  }

  private async _registerFile(
    file: FileValidationPipeDto,
    authorId: string,
    description: string,
    tags: string[],
    temporary: boolean,
  ) {
    return await this.filesService.create({
      authorId,
      description,
      tags,
      temporary,
      name: this.appHostService.app
        .get<StringExService>('IStringExService')
        .getFilename(file.data.originalname),
      mimetype: this.appHostService.app
        .get<StringExService>('IStringExService')
        .getFileExtension(file.data.originalname),
      size: file.data.size,
      compressedSize: 0,
      meta: { gridFSId: null },
    });
  }

  private async _removeFile(id: string) {
    const deleted = await this.filesService.delete(id);

    if (deleted instanceof Error)
      return this._handleHttpExceptionWithMessage(deleted.message);

    if (!deleted)
      return this._handleHttpExceptionWithMessage(
        'File not deleted. Try again.',
      );

    return true;
  }

  private async _uploadLocalFile(
    file: FileValidationPipeDto,
    filename: string,
    mimetype: string,
    version: number,
  ) {
    try {
      const folderPath = `${this._filesPath}/${filename}`;

      this.appHostService.app
        .get<LocalPathService>('ILocalPathService')
        .localCreate(folderPath);

      const filePath = `${folderPath}/${filename}_v${version}${mimetype}`;

      return fs.writeFileSync(
        this.appHostService.app
          .get<LocalPathService>('ILocalPathService')
          .local(filePath),
        file.data.buffer,
      );
    } catch (error) {
      return this._handleHttpExceptionWithMessage(error.message);
    }
  }

  private async _registerFileInGridFS(
    file: FileValidationPipeDto,
    authorId: string,
    filename: string,
    fileext: string,
    size: number,
    version: number,
  ) {
    return await this.appHostService.app
      .get<FileGridfsService>('IFileGridfsService')
      .openUploadStream(file.data.stream, {
        authorId,
        filename,
        fileext,
        size: this.appHostService.app
          .get<StringExService>('IStringExService')
          .bytesToString(size),
        version,
        status: 'Active',
      });
  }

  private async _registerAWSFile(
    file: FileValidationPipeDto,
    filename: string,
    mimetype: string,
    version: number,
    bucket: string,
    serverSideEncryption: string,
  ) {
    return await this.appHostService.app
      .get<AwsS3Service>('IAwsS3Service')
      .upload(
        file.data,
        filename,
        mimetype,
        version,
        bucket,
        serverSideEncryption,
      );
  }

  private async _uploadFile(
    file: FileValidationPipeDto,
    headers,
    authorId: string,
    description: string,
    tags: string[],
    temporary: boolean,
  ) {
    if (!file.success) return this._handleHttpExceptionFileNotSuccess(file);

    if (this._headersIsInvalid(headers))
      return this._handleHttpExceptionWithMessage('Check your headers');

    const fileStored = await this._registerFile(
      file,
      authorId,
      description,
      tags,
      temporary,
    );

    if (fileStored instanceof Error)
      return this._handleHttpExceptionWithMessage(fileStored.message);

    return this.filesParser.toJSON(fileStored);
  }

  private async _downloadLocalFile(
    filename: string,
    mimetype: string,
    version: number,
  ) {
    try {
      const folderPath = `${this._filesPath}/${filename}`;

      this.appHostService.app
        .get<LocalPathService>('ILocalPathService')
        .localCreate(folderPath);

      const filePath = `${folderPath}/${filename}_v${version}${mimetype}`;

      return fs.readFileSync(
        this.appHostService.app
          .get<LocalPathService>('ILocalPathService')
          .local(filePath),
      );
    } catch (error) {
      return this._handleHttpExceptionWithMessage(error.message);
    }
  }

  private async _openReadStreamLocalFile(
    filename: string,
    mimetype: string,
    version: number,
  ) {
    try {
      const folderPath = `${this._filesPath}/${filename}`;

      this.appHostService.app
        .get<LocalPathService>('ILocalPathService')
        .localCreate(folderPath);

      const filePath = `${folderPath}/${filename}_v${version}${mimetype}`;

      return fs.createReadStream(
        this.appHostService.app
          .get<LocalPathService>('ILocalPathService')
          .local(filePath),
      );
    } catch (error) {
      return this._handleHttpExceptionWithMessage(error.message);
    }
  }

  private async _downloadAWSFile(
    filename: string,
    mimetype: string,
    version: number,
    bucket: string,
  ) {
    try {
      return await this.appHostService.app
        .get<AwsS3Service>('IAwsS3Service')
        .get(filename, mimetype, version, bucket);
    } catch (error) {
      return this._handleHttpExceptionWithMessage(error.message);
    }
  }

  private async _removeLocalFile(
    filename: string,
    mimetype: string,
    version: number,
  ) {
    try {
      const folderPath = `${this._filesPath}/${filename}`;

      this.appHostService.app
        .get<LocalPathService>('ILocalPathService')
        .localCreate(folderPath);

      const filePath = `${folderPath}/${filename}_v${version}${mimetype}`;

      return fs.unlinkSync(
        this.appHostService.app
          .get<LocalPathService>('ILocalPathService')
          .local(filePath),
      );
    } catch (error) {
      return this._handleHttpExceptionWithMessage(error.message);
    }
  }

  private async _removeFileInGridFS(
    authorId: string,
    filename: string,
    fileext: string,
    version: number,
  ) {
    return await this.appHostService.app
      .get<FileGridfsService>('IFileGridfsService')
      .delete(authorId, filename, fileext, version);
  }

  private async _removeAWSFile(
    filename: string,
    mimetype: string,
    version: number,
    bucket: string,
  ) {
    try {
      return await this.appHostService.app
        .get<AwsS3Service>('IAwsS3Service')
        .delete(filename, mimetype, version, bucket);
    } catch (error) {
      return this._handleHttpExceptionWithMessage(error.message);
    }
  }

  @Get()
  async findAll(@Query('limit') limit: string, @Query('skip') skip: string) {
    return (
      await this.filesService.findAll(
        limit && parseInt(limit),
        skip && parseInt(skip),
      )
    ).map((file) => this.filesParser.toJSON(file));
  }

  @Post('local/single')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5242880,
      },
    }),
  )
  async uploadLocalFile(
    @Headers() headers,
    @UploadedFile(FileSingleValidationPipe) file: FileValidationPipeDto,
  ) {
    try {
      const { author_id, description, temporary, tags } = headers;

      if (this._headersIsInvalid(headers))
        return this._handleHttpExceptionWithMessage('Check your headers');

      if (!this._createUploadFolder())
        return this._handleHttpExceptionWithMessage(
          'Local Path is not defined. Please check your .env file',
        );

      const fileStored = await this._uploadFile(
        file,
        headers,
        author_id,
        description,
        String(tags)
          .split(',')
          .map((tag) => tag.trim()),
        String(temporary).toLocaleLowerCase().trim() === 'true' ? true : false,
      );

      if (fileStored instanceof Error) return fileStored;

      const store = await this._uploadLocalFile(
        file,
        fileStored.name,
        fileStored.mimetype,
        fileStored.version,
      );

      if (store instanceof Error)
        return this._handleHttpExceptionWithMessage(store.message);

      return fileStored;
    } catch (error) {
      return this._handleHttpExceptionWithMessage(error.message);
    }
  }

  @Get('local/single')
  async getLocalFile(@Query('id') id: string, @Res() res: Response) {
    try {
      const file = await this.filesService.findOne(id);

      if (file instanceof Error)
        return this._handleHttpExceptionWithMessage(file.message);

      res.set({
        'Content-Disposition': `attachment; filename="${file.name}_v${file.version}${file.mimetype}"`,
      });

      const buffer = await this._downloadLocalFile(
        file.name,
        file.mimetype,
        file.version,
      );

      if (buffer instanceof Error) return buffer;

      return res.send(buffer);
    } catch (error) {
      return this._handleHttpExceptionWithMessage(error.message);
    }
  }

  @Post('local/multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 5242880 },
    }),
  )
  async uploadLocalFiles(
    @Headers() headers,
    @UploadedFiles(FileMultipleValidationPipe) files: FileValidationPipeDto[],
  ) {
    return new Promise(async (resolve, reject) => {
      const reply = [];

      this._createUploadFolder();

      for await (const file of files) {
        try {
          const { author_id, description, temporary, tags } = headers;

          if (this._headersIsInvalid(headers))
            return reject(
              this._handleHttpExceptionWithMessage('Check your headers'),
            );

          const fileStored = await this._uploadFile(
            file,
            headers,
            author_id,
            description,
            String(tags).split(','),
            temporary === 'true' ? true : false,
          );

          if (fileStored instanceof Error) return reject(fileStored);

          const store = await this._uploadLocalFile(
            file,
            fileStored.name,
            fileStored.mimetype,
            fileStored.version,
          );

          if (store instanceof Error)
            return this._handleHttpExceptionWithMessage(store.message);

          reply.push(fileStored);
        } catch (error) {
          return reject(this._handleHttpExceptionWithMessage(error.message));
        }
      }

      return resolve(reply);
    });
  }

  @Get('local/multiple')
  async getLocalFiles(@Query('files') files: string, @Res() res: Response) {
    return new Promise(async (resolve, reject) => {
      const filesId = String(files).split(',');
      const filesStream: Reader[] = [];

      if (filesId.length === 0)
        return reject(
          this._handleHttpExceptionWithMessage('No files to download'),
        );

      res.set({
        'Content-Disposition': `attachment; filename="${Date.now()}.gz"`,
      });

      for (const fileId of filesId) {
        try {
          const file = await this.filesService.findOne(fileId);

          if (file instanceof Error)
            return reject(this._handleHttpExceptionWithMessage(file.message));

          const stream = await this._openReadStreamLocalFile(
            file.name,
            file.mimetype,
            file.version,
          );

          if (stream instanceof Error) return reject(stream);

          filesStream.push({
            filename: `${file.name}_v${file.version}${file.mimetype}`,
            stream,
            version: `${file.version}`,
          });
        } catch (error) {
          return reject(this._handleHttpExceptionWithMessage(error.message));
        }
      }

      try {
        return resolve(
          await this.appHostService.app
            .get<ArchiveService>('IArchiveService')
            .joinWithReaders(res, filesStream),
        );
      } catch (error) {
        return reject(this._handleHttpExceptionWithMessage(error.message));
      }
    });
  }

  @Delete('local/single')
  async deleteLocalFile(@Query('id') id: string) {
    try {
      const file = await this.filesService.findOne(id);

      if (file instanceof Error)
        return this._handleHttpExceptionWithMessage(file.message);

      const fileDeleted = await this._removeFile(id);

      if (fileDeleted instanceof Error) return fileDeleted;

      const deleted = await this._removeLocalFile(
        file.name,
        file.mimetype,
        file.version,
      );

      if (deleted instanceof Error) return deleted;

      return `File with id(${id}) deleted`;
    } catch (error) {
      return this._handleHttpExceptionWithMessage(error.message);
    }
  }

  @Delete('local/multiple')
  async deleteLocalFiles(@Query('files') files: string) {
    return new Promise(async (resolve, reject) => {
      const filesId = String(files).split(',');
      const reply = [];

      if (filesId.length === 0)
        return reject(
          this._handleHttpExceptionWithMessage('No files to delete'),
        );

      for (const fileId of filesId) {
        try {
          const file = await this.filesService.findOne(fileId);

          if (file instanceof Error)
            return reject(this._handleHttpExceptionWithMessage(file.message));

          const fileDeleted = await this._removeFile(fileId);

          if (fileDeleted instanceof Error) return fileDeleted;

          const deleted = await this._removeLocalFile(
            file.name,
            file.mimetype,
            file.version,
          );

          if (deleted instanceof Error) return reject(deleted);

          reply.push(`File with id(${fileId}) deleted`);
        } catch (error) {
          return reject(this._handleHttpExceptionWithMessage(error.message));
        }
      }

      try {
        return resolve(reply);
      } catch (error) {
        return reject(this._handleHttpExceptionWithMessage(error.message));
      }
    });
  }

  @Post('mongodb/single')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5242880,
      },
    }),
  )
  async uploadMongoDBFile(
    @Headers() headers,
    @UploadedFile(FileSingleValidationPipe) file: FileValidationPipeDto,
  ) {
    try {
      const { author_id, description, temporary, tags } = headers;

      if (this._headersIsInvalid(headers))
        return this._handleHttpExceptionWithMessage('Check your headers');

      let fileStored = await this._uploadFile(
        file,
        headers,
        author_id,
        description,
        String(tags).split(','),
        temporary === 'true' ? true : false,
      );

      if (fileStored instanceof Error) return fileStored;

      const fileGridFS = await this._registerFileInGridFS(
        file,
        author_id,
        fileStored.name,
        fileStored.mimetype,
        fileStored.size,
        fileStored.version,
      );

      if (fileGridFS instanceof Error)
        return this._handleHttpExceptionWithMessage(fileGridFS.message);

      fileStored = await this.filesService.update(fileStored.id as string, {
        compressedSize: fileGridFS.compressedSize,
        meta: {
          ...fileStored.meta,
          gridFSId: fileGridFS.fileId.toString(),
        },
      });

      if (fileStored instanceof Error)
        return this._handleHttpExceptionWithMessage(fileStored.message);

      return fileStored;
    } catch (error) {
      return this._handleHttpExceptionWithMessage(error.message);
    }
  }

  @Get('mongodb/single')
  async getMongoDBFile(
    @Query('id') id: string,
    @Query('decompress') decompress: string,
    @Res() res: Response,
  ) {
    try {
      const file = await this.filesService.findOne(id);

      if (file instanceof Error)
        return this._handleHttpExceptionWithMessage(file.message);

      res.set({
        'Content-Disposition': `attachment; filename="${file.name}_v${
          file.version
        }${file.mimetype}${this._isDecompress(decompress) ? '' : '.gz'}"`,
      });

      return await this.appHostService.app
        .get<FileGridfsService>('IFileGridfsService')
        .openDownloadStream(
          res,
          new ObjectId(file.meta.gridFSId),
          this._isDecompress(decompress),
        );
    } catch (error) {
      return this._handleHttpExceptionWithMessage(error.message);
    }
  }

  @Post('mongodb/multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 5242880 },
    }),
  )
  async uploadMongoDBFiles(
    @Headers() headers,
    @UploadedFiles(FileMultipleValidationPipe) files: FileValidationPipeDto[],
  ) {
    return new Promise(async (resolve, reject) => {
      const reply = [];

      for await (const file of files) {
        try {
          const { author_id, description, temporary, tags } = headers;

          if (this._headersIsInvalid(headers))
            return reject(
              this._handleHttpExceptionWithMessage('Check your headers'),
            );

          let fileStored = await this._uploadFile(
            file,
            headers,
            author_id,
            description,
            String(tags).split(','),
            temporary === 'true' ? true : false,
          );

          if (fileStored instanceof Error) return reject(fileStored);

          const fileGridFS = await this._registerFileInGridFS(
            file,
            author_id,
            fileStored.name,
            fileStored.mimetype,
            fileStored.size,
            fileStored.version,
          );

          if (fileGridFS instanceof Error)
            return this._handleHttpExceptionWithMessage(fileGridFS.message);

          fileStored = await this.filesService.update(fileStored.id as string, {
            compressedSize: fileGridFS.compressedSize,
            meta: {
              ...fileStored.meta,
              gridFSId: fileGridFS.fileId.toString(),
            },
          });

          if (fileStored instanceof Error)
            return this._handleHttpExceptionWithMessage(fileStored.message);

          reply.push(fileStored);
        } catch (error) {
          return reject(this._handleHttpExceptionWithMessage(error.message));
        }
      }

      return resolve(reply);
    });
  }

  @Get('mongodb/multiple')
  async getMongoDBFiles(@Query('files') files: string, @Res() res: Response) {
    return new Promise(async (resolve, reject) => {
      const filesId = String(files).split(',');
      const filesStream: Reader[] = [];

      if (filesId.length === 0)
        return reject(
          this._handleHttpExceptionWithMessage('No files to download'),
        );

      res.set({
        'Content-Disposition': `attachment; filename="${Date.now()}.gz"`,
      });

      for (const fileId of filesId) {
        try {
          const file = await this.filesService.findOne(fileId);

          if (file instanceof Error)
            return reject(this._handleHttpExceptionWithMessage(file.message));

          filesStream.push({
            filename: `${file.name}_v${file.version}${file.mimetype}.gz`,
            stream: await this.appHostService.app
              .get<FileGridfsService>('IFileGridfsService')
              .getDownloadStream(new ObjectId(file.meta.gridFSId)),
            version: `${file.version}`,
          });
        } catch (error) {
          return reject(this._handleHttpExceptionWithMessage(error.message));
        }
      }

      try {
        return resolve(
          await this.appHostService.app
            .get<ArchiveService>('IArchiveService')
            .joinWithReaders(res, filesStream),
        );
      } catch (error) {
        return reject(this._handleHttpExceptionWithMessage(error.message));
      }
    });
  }

  @Delete('mongodb/single')
  async deleteMongoDBFile(@Query('id') id: string) {
    try {
      const file = await this.filesService.findOne(id);

      if (file instanceof Error)
        return this._handleHttpExceptionWithMessage(file.message);

      const fileDeleted = await this._removeFile(id);

      if (fileDeleted instanceof Error) return fileDeleted;

      await this._removeFileInGridFS(
        file.authorId,
        file.name,
        file.mimetype,
        file.version,
      );

      return `File with id(${id}) deleted`;
    } catch (error) {
      return this._handleHttpExceptionWithMessage(error.message);
    }
  }

  @Delete('mongodb/multiple')
  async deleteMongoDBFiles(@Query('files') files: string) {
    return new Promise(async (resolve, reject) => {
      const filesId = String(files).split(',');
      const reply = [];

      if (filesId.length === 0)
        return reject(
          this._handleHttpExceptionWithMessage('No files to delete'),
        );

      for (const fileId of filesId) {
        try {
          const file = await this.filesService.findOne(fileId);

          if (file instanceof Error)
            return reject(this._handleHttpExceptionWithMessage(file.message));

          const fileDeleted = await this._removeFile(fileId);

          if (fileDeleted instanceof Error) return fileDeleted;

          await this._removeFileInGridFS(
            file.authorId,
            file.name,
            file.mimetype,
            file.version,
          );

          reply.push(`File with id(${file.id}) deleted`);
        } catch (error) {
          return reject(this._handleHttpExceptionWithMessage(error.message));
        }
      }

      try {
        return resolve(reply);
      } catch (error) {
        return reject(this._handleHttpExceptionWithMessage(error.message));
      }
    });
  }

  @Post('aws/single')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5242880,
      },
    }),
  )
  async uploadAWSFile(
    @Headers() headers,
    @UploadedFile(FileSingleValidationPipe) file: FileValidationPipeDto,
  ) {
    try {
      const { author_id, description, temporary, tags } = headers;

      if (this._headersIsInvalid(headers))
        return this._handleHttpExceptionWithMessage('Check your headers');

      this._createUploadFolder();

      const fileStored = await this._uploadFile(
        file,
        headers,
        author_id,
        description,
        String(tags).split(','),
        temporary === 'true' ? true : false,
      );

      if (fileStored instanceof Error) return fileStored;

      const downloadURL = await this._registerAWSFile(
        file,
        fileStored.name,
        fileStored.mimetype,
        fileStored.version,
        this._buckets.single,
        this._awsEncryptAlgorithm,
      );

      if (downloadURL instanceof Error)
        return this._handleHttpExceptionWithMessage(downloadURL.message);

      return {
        ...fileStored,
        downloadURL,
      };
    } catch (error) {
      return this._handleHttpExceptionWithMessage(error.message);
    }
  }

  @Get('aws/single')
  async getAWSFile(@Query('id') id: string, @Res() res: Response) {
    try {
      const file = await this.filesService.findOne(id);

      if (file instanceof Error)
        return this._handleHttpExceptionWithMessage(file.message);

      res.set({
        'Content-Disposition': `attachment; filename="${file.name}_v${file.version}${file.mimetype}"`,
      });

      const fileAWS = await this._downloadAWSFile(
        file.name,
        file.mimetype,
        file.version,
        this._buckets.single,
      );

      if (fileAWS instanceof Error) return fileAWS;

      return res.send(fileAWS.Body);
    } catch (error) {
      return this._handleHttpExceptionWithMessage(error.message);
    }
  }

  @Post('aws/multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 5242880 },
    }),
  )
  async uploadAWSFiles(
    @Headers() headers,
    @UploadedFiles(FileMultipleValidationPipe) files: FileValidationPipeDto[],
  ) {
    return new Promise(async (resolve, reject) => {
      const reply = [];

      for await (const file of files) {
        try {
          const { author_id, description, temporary, tags } = headers;

          if (this._headersIsInvalid(headers))
            return reject(
              this._handleHttpExceptionWithMessage('Check your headers'),
            );

          const fileStored = await this._uploadFile(
            file,
            headers,
            author_id,
            description,
            String(tags).split(','),
            temporary === 'true' ? true : false,
          );

          if (fileStored instanceof Error) return reject(fileStored);

          const downloadURL = await this._registerAWSFile(
            file,
            fileStored.name,
            fileStored.mimetype,
            fileStored.version,
            this._buckets.multiple,
            this._awsEncryptAlgorithm,
          );

          if (downloadURL instanceof Error)
            return this._handleHttpExceptionWithMessage(downloadURL.message);

          reply.push({
            ...fileStored,
            downloadURL,
          });
        } catch (error) {
          return reject(this._handleHttpExceptionWithMessage(error.message));
        }
      }

      return resolve(reply);
    });
  }

  @Get('aws/multiple')
  async getAWSFiles(@Query('files') files: string, @Res() res: Response) {
    return new Promise(async (resolve, reject) => {
      const filesId = String(files).split(',');
      const filesStream: Reader[] = [];

      if (filesId.length === 0)
        return reject(
          this._handleHttpExceptionWithMessage('No files to download'),
        );

      res.set({
        'Content-Disposition': `attachment; filename="${Date.now()}.gz"`,
      });

      for (const fileId of filesId) {
        try {
          const file = await this.filesService.findOne(fileId);

          if (file instanceof Error)
            return reject(this._handleHttpExceptionWithMessage(file.message));

          const fileAWS = await this._downloadAWSFile(
            file.name,
            file.mimetype,
            file.version,
            this._buckets.multiple,
          );

          if (fileAWS instanceof Error) return reject(fileAWS);

          const stream = Readable.from(fileAWS.Body as Buffer);

          filesStream.push({
            filename: `${file.name}_v${file.version}${file.mimetype}`,
            stream,
            version: `${file.version}`,
          });
        } catch (error) {
          return reject(this._handleHttpExceptionWithMessage(error.message));
        }
      }

      try {
        return resolve(
          await this.appHostService.app
            .get<ArchiveService>('IArchiveService')
            .joinWithReaders(res, filesStream),
        );
      } catch (error) {
        return reject(this._handleHttpExceptionWithMessage(error.message));
      }
    });
  }

  @Delete('aws/single')
  async deleteAWSFile(@Query('id') id: string) {
    try {
      const file = await this.filesService.findOne(id);

      if (file instanceof Error)
        return this._handleHttpExceptionWithMessage(file.message);

      const fileDeleted = await this._removeFile(id);

      if (fileDeleted instanceof Error) return fileDeleted;

      const deleted = await this._removeAWSFile(
        file.name,
        file.mimetype,
        file.version,
        this._buckets.single,
      );

      if (deleted instanceof Error)
        return this._handleHttpExceptionWithMessage(deleted.message);

      return `File with id(${id}) deleted`;
    } catch (error) {
      return this._handleHttpExceptionWithMessage(error.message);
    }
  }

  @Delete('aws/multiple')
  async deleteAWSFiles(@Query('files') files: string) {
    return new Promise(async (resolve, reject) => {
      const filesId = String(files).split(',');
      const reply = [];

      if (filesId.length === 0)
        return reject(
          this._handleHttpExceptionWithMessage('No files to delete'),
        );

      for (const fileId of filesId) {
        try {
          const file = await this.filesService.findOne(fileId);

          if (file instanceof Error)
            return reject(this._handleHttpExceptionWithMessage(file.message));

          const fileDeleted = await this._removeFile(fileId);

          if (fileDeleted instanceof Error) return fileDeleted;

          const deleted = await this._removeAWSFile(
            file.name,
            file.mimetype,
            file.version,
            this._buckets.multiple,
          );

          if (deleted instanceof Error)
            return reject(
              this._handleHttpExceptionWithMessage(deleted.message),
            );

          reply.push(`File with id(${fileId}) deleted`);
        } catch (error) {
          return reject(this._handleHttpExceptionWithMessage(error.message));
        }
      }

      try {
        return resolve(reply);
      } catch (error) {
        return reject(this._handleHttpExceptionWithMessage(error.message));
      }
    });
  }
}
