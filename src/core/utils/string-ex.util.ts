// import LZString from 'lz-string';
// import LZUTF8 from 'lzutf8';
import { deflate, inflate } from 'pako';

import { createHash } from 'crypto';

import Sugar from 'sugar';

import { hash, compare } from 'bcrypt';

export type MaskPhoneType = 'cell' | 'tel';

export class StringEx {
  constructor() {
    throw new Error('this is static class');
  }

  /**
   * @description Compresses a {string | Uint8Array | Buffer} to base64
   */
  static Compress(data: string | Uint8Array | Buffer) {
    const base64 = Buffer.from(deflate(data)).toString('base64');

    return base64;
  }

  /**
   * @description Decompresses a string from base64 to {Type | string | Uint8Array | Buffer}
   */
  static Decompress<Type>(
    encoded: string,
  ): Type | string | Uint8Array | Buffer {
    const base64 = JSON.parse(
      inflate(new Uint8Array(Buffer.from(encoded, 'base64')), {
        to: 'string',
      }),
    );

    return base64;
  }

  /**
   * @description Return hash from password
   */
  static async HashByPassword(password: string, saltRounds?: number) {
    if (!saltRounds) saltRounds = 10;

    return await hash(password, saltRounds < 10 ? 10 : saltRounds);
  }

  /**
   * @description Compare hash from password
   */
  static async compareHashPassword(password: string, hashed: string) {
    return await compare(password, hashed);
  }

  /**
   * @description Return hash from string
   */
  static Hash(
    txt: string,
    algorithm: 'md5' | 'sha1' | 'sha256' | 'sha512',
    digest: 'base64' | 'base64url' | 'hex',
  ): string {
    const hash = createHash(algorithm);

    hash.update(txt);

    return hash.digest(digest);
  }

  /**
   * @description Return bytes to string
   */
  static BytesToString(bytes: number): string {
    return Sugar.Number.bytes(bytes, 2, true);
  }

  /**
   * @description Convert a string to money format
   */
  static maskMoney(value: number): string {
    const formatter = value.toLocaleString('pt-br', {
      minimumFractionDigits: 2,
    });

    return `R$ ${formatter}`;
  }

  /**
   * @description Convert a string to phone pretty
   */
  static maskPhone(value: string, type: MaskPhoneType): string {
    switch (type) {
      case 'cell':
        return value
          .toString()
          .replace(/[\D]/g, '')
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .replace(/(-\d{4})(\d+?)/, '$1');
      default:
      case 'tel':
        return value
          .toString()
          .replace(/[\D]/g, '')
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2')
          .replace(/(-\d{4})(\d+?)/, '$1');
    }
  }

  /**
   * @description Convert a string to zipcode pretty
   */
  static maskZipcode(value: string): string {
    const formatter = value
      .toString()
      .replace(/[\D]/g, '')
      .replace(/(\d{5})(\d+?)/, '$1-$2')
      .replace(/(-\d{3})(\d+?)/, '$1');

    return formatter;
  }

  /**
   * @description Convert a string to CNPJ pretty
   */
  static maskCNPJ(value: string): string {
    const formatter = value
      .toString()
      .replace(/[\D]/g, '')
      .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
      .replace(/(-\d{2})(\d+?)/, '$1');

    return formatter;
  }

  /**
   * @description Convert a string to CPF pretty
   */
  static maskCPF(value: string): string {
    const formatter = value
      .toString()
      .replace(/[\D]/g, '')
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      .replace(/(-\d{2})(\d+?)/, '$1');

    return formatter;
  }

  /**
   * @description Convert a string to RG pretty
   */
  static maskRG(value: string): string {
    const formatter = value
      .toString()
      .replace(/[\D]/g, '')
      .replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
      .replace(/(-\d{1})(\d+?)/, '$1');

    return formatter;
  }
}
