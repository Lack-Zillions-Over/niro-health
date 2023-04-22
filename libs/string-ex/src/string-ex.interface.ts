export type CompressData = string | Uint8Array | Buffer;

export type MaskPhoneType = 'cell' | 'tel';

export namespace Hash {
  export type algorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';
  export type digest = 'base64' | 'base64url' | 'hex';
}

export interface IStringExService {
  LZStringCompressToEncodedURIComponent(data: string): string;
  LZStringDecompressFromEncodedURIComponent(encoded: string): string;
  compress(data: CompressData): string;
  decompress(encoded: string): CompressData;
  hashPassword(password: string, saltRounds?: number): Promise<string>;
  compareHashPassword(password: string, hashed: string): Promise<boolean>;
  hash(txt: string, algorithm: Hash.algorithm, digest: Hash.digest): string;
  bytesToString(bytes: string | number): string;
  getFilename(name: string): string;
  getFileExtension(name: string): string;
  extractNumbers(value: string): number[];
  maskMoney(value: string | number): string;
  maskPhone(value: string | number, type: MaskPhoneType): string;
  maskZipcode(value: string | number): string;
  maskCNPJ(value: string | number): string;
  maskCPF(value: string | number): string;
  maskRG(value: string | number): string;
}
