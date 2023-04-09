import { Test, TestingModule } from '@nestjs/testing';
import { StringExService } from './string-ex.service';

describe('StringExService', () => {
  let service: StringExService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StringExService],
    }).compile();

    service = module.get<StringExService>(StringExService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be return bytes to string', () => {
    const bytes = service.bytesToString(20049);
    expect(bytes).toBe('19.58KiB');
  });

  it('should be get name of file', () => {
    const filename = service.getFilename('MyPhoto.png');
    expect(filename).toBe('MyPhoto');
  });

  it('should be get extension of file', () => {
    const filename = service.getFileExtension('MyPhoto.png');
    expect(filename).toBe('.png');
  });

  it('should be return hash from string', () => {
    const text = 'Hello World';
    const hash = service.hash(text, 'md5', 'hex');
    expect(hash).not.toBe(text);
  });

  it('should be return hash from password', async () => {
    const password = '123456';
    await expect(service.hashPassword(password)).resolves.not.toBe(password);
  });

  it('should be compare hash from password', async () => {
    const password = '123456';
    const hash = await service.hashPassword(password);
    const result = await service.compareHashPassword(password, hash);
    expect(result).toBe(true);
  });

  it('should be extract numbers from string', () => {
    const text = 'Hello World 123';
    const numbers = service.extractNumbers(text);
    expect(numbers).toStrictEqual([123]);
  });

  describe('Tests for Compress/Decompress', () => {
    it('should be compresses a string to encodedURIComponent', () => {
      const text = 'Hello World';
      const compressed = service.LZStringCompressToEncodedURIComponent(text);
      expect(compressed).not.toBe(text);
    });

    it('should be decompresses a string from encodedURIComponent', () => {
      const text = 'Hello World';
      const compressed = service.LZStringCompressToEncodedURIComponent(text);
      const decompressed =
        service.LZStringDecompressFromEncodedURIComponent(compressed);
      expect(text).toBe(decompressed);
    });

    it('should be compress string', () => {
      const text = 'Hello World';
      const compressed = service.compress(text);
      expect(compressed).not.toBe(text);
    });

    it('should be decompress string', () => {
      const text = 'Hello World';
      const compressed = service.compress(text);
      const decompressed = service.decompress(compressed);
      expect(text).toStrictEqual(decompressed);
    });

    it('should be compress JSON', () => {
      const json = { a: 100, b: true, c: { d: 'Niro Health' } };
      const compressed = service.compress(json);
      expect(compressed).not.toBe(json);
    });

    it('should be decompress JSON', () => {
      const json = { a: 100, b: true, c: { d: 'Niro Health' } };
      const compressed = service.compress(json);
      const decompressed = service.decompress(compressed);
      expect(json).toStrictEqual(decompressed);
    });
  });

  describe('Tests for texts masks', () => {
    it('should be convert a string to RG pretty', () => {
      const text = '875029292';
      const mask = service.maskRG(text);
      expect(mask).toBe('87.502.929-2');
    });

    it('should be convert a string to CPF pretty', () => {
      const text = '758636180000';
      const mask = service.maskCPF(text);
      expect(mask).toBe('758.636.180-00');
    });

    it('should be convert a string to Money format', () => {
      const money = 1250.99;
      const mask = service.maskMoney(money);
      expect(mask).toBe('R$ 1.250,99');
    });

    it('should be convert a string to Phone(Cell) pretty', () => {
      const text = '99999999999';
      const mask = service.maskPhone(text, 'cell');
      expect(mask).toBe('(99) 99999-9999');
    });

    it('should be convert a string to Phone(Tel) pretty', () => {
      const text = '9999999999';
      const mask = service.maskPhone(text, 'tel');
      expect(mask).toBe('(99) 9999-9999');
    });

    it('should be convert a string to CNPJ pretty', () => {
      const text = '85464122000191';
      const mask = service.maskCNPJ(text);
      expect(mask).toBe('85.464.122/0001-91');
    });

    it('should be convert a string to zipcode pretty', () => {
      const text = '04833001';
      const mask = service.maskZipcode(text);
      expect(mask).toBe('04833-001');
    });
  });
});
