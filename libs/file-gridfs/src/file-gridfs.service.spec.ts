import { Test, TestingModule } from '@nestjs/testing';

import * as fs from 'fs';
import * as path from 'path';

import { FileGridfsService } from './file-gridfs.service';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { MongoDBService } from '@app/core/mongodb/mongodb.service';
import { DebugService } from '@app/debug';

jest.mock('mongoose', () => jest.requireActual('@test/mocks/mongoose'));
jest.mock('mongodb', () => jest.requireActual('@test/mocks/mongodb'));

describe('FileGridfsService', () => {
  let service: FileGridfsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileGridfsService,
        { provide: 'IConfigurationService', useClass: ConfigurationService },
        {
          provide: 'IValidatorRegexpService',
          useClass: ValidatorRegexpService,
        },
        { provide: 'IStringExService', useClass: StringExService },
        { provide: 'IMongoDBService', useClass: MongoDBService },
        { provide: 'IDebugService', useClass: DebugService },
      ],
    }).compile();

    service = module.get<FileGridfsService>(FileGridfsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be upload file', async () => {
    const file = fs.createReadStream(path.join(__dirname, 'test', 'text.txt'));
    await expect(
      service.openUploadStream(file, {
        filename: 'text',
        authorId: '123456def',
        fileext: '.txt',
        version: 1,
        size: '1GB',
        status: 'Active',
      }),
    ).resolves.toStrictEqual({
      compressedSize: 123456,
      fileId: '123456def',
      version: 1,
      status: 'Active',
    });
  });

  it('should be download file', async () => {
    const file = fs.createWriteStream(
      path.join(__dirname, 'test', 'copy-file.txt'),
    );
    await expect(
      service.openDownloadStream(file, '123456def' as any),
    ).resolves.toBeDefined();
  });

  it('should be get download stream', async () => {
    await expect(
      service.getDownloadStream('123456def' as any),
    ).resolves.toBeDefined();
  });

  it('should be get version file', async () => {
    await expect(service.getVersion('123456def', 'text', '.txt')).resolves.toBe(
      1,
    );
  });

  it('should be rename file', async () => {
    await expect(
      service.rename('123456def', 'text', '.txt', 'other-name'),
    ).resolves.toBeUndefined();
  });

  it('should be delete file', async () => {
    await expect(
      service.delete('123456def', 'text', '.txt', 1),
    ).resolves.toBeUndefined();
  });
});
