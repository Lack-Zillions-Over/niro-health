import { Test, TestingModule } from '@nestjs/testing';
import { ArchiveService } from './archive.service';

import { resolve, dirname } from 'path';
import {
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
  createWriteStream,
  createReadStream,
} from 'fs-extra';

const pathDataDir = resolve(dirname(__filename), './data');
const resolvePathFileDataDir = (...paths: string[]) =>
  resolve(dirname(__filename), './data', ...paths);
const rmSyncRoot = () => {
  if (existsSync(pathDataDir))
    rmSync(pathDataDir, { recursive: true, force: true });
};
const mkdirRoot = () => {
  if (!existsSync(pathDataDir)) mkdirSync(pathDataDir);
};
const writeJSON = () => {
  writeFileSync(
    resolvePathFileDataDir('./file.json'),
    JSON.stringify({ say: { hi: 'Hello World' } }, null, 2),
  );
};

describe('ArchiveService', () => {
  let service: ArchiveService;

  beforeAll(() => {
    rmSyncRoot();
    mkdirRoot();
    writeJSON();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArchiveService],
    }).compile();

    service = module.get<ArchiveService>(ArchiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined level compression', async () => {
    await expect(
      service.setCompressionLevel('DEFAULT_COMPRESSION'),
    ).resolves.toBeUndefined();
  });

  it('should be get level compression', async () => {
    await expect(service.getCompressionLevel()).resolves.toBe(
      'DEFAULT_COMPRESSION',
    );
  });

  it('should write "testing.gz" with', async () => {
    const writeStream = createWriteStream(
      resolvePathFileDataDir('./testing.gz'),
    );
    const readStream = createReadStream(resolvePathFileDataDir('./file.json'));
    await expect(
      service.joinWithReaders(writeStream, [
        {
          filename: 'file.json',
          stream: readStream,
          version: '1',
        },
      ]),
    ).resolves.not.toThrowError();
  });
});
