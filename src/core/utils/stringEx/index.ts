import { deflate, inflate } from 'pako';
import * as LZString from 'lz-string';
import * as Sugar from 'sugar';

import { createHash } from 'crypto';
import { hash, compare } from 'bcrypt';

import { StringEx as Types } from '@/core/utils/stringEx/types';

export class StringEx implements Types.Class {
  /**
   * @description Compresses a string to EncodedURIComponent
   */
  public LZStringCompressToEncodedURIComponent(data: string) {
    return LZString.compressToEncodedURIComponent(data);
  }

  /**
   * @description Decompresses a string from EncodedURIComponent to string
   */
  public LZStringDecompressFromEncodedURIComponent(encoded: string) {
    return LZString.decompressFromEncodedURIComponent(encoded);
  }

  /**
   * @description Compresses a {string | Uint8Array | Buffer} to base64
   */
  public compress(data: string | Uint8Array | Buffer) {
    const base64 = Buffer.from(deflate(data)).toString('base64');

    return base64;
  }

  /**
   * @description Decompresses a string from base64 to {Type | string | Uint8Array | Buffer}
   */
  public decompress<Type>(
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
  public async hashByPassword(password: string, saltRounds?: number) {
    if (!saltRounds) saltRounds = 10;

    return await hash(password, saltRounds < 10 ? 10 : saltRounds);
  }

  /**
   * @description Compare hash from password
   */
  public async compareHashPassword(password: string, hashed: string) {
    return await compare(password, hashed);
  }

  /**
   * @description Return hash from string
   */
  public hash(
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
  public bytesToString(bytes: number): string {
    return Sugar.Number.bytes(bytes, 2, true);
  }

  /**
   * @description Convert a string to money format
   */
  public maskMoney(value: number): string {
    const formatter = value.toLocaleString('pt-br', {
      minimumFractionDigits: 2,
    });

    return `R$ ${formatter}`;
  }

  /**
   * @description Convert a string to phone pretty
   */
  public maskPhone(value: string, type: Types.MaskPhoneType): string {
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
  public maskZipcode(value: string): string {
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
  public maskCNPJ(value: string): string {
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
  public maskCPF(value: string): string {
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
  public maskRG(value: string): string {
    const formatter = value
      .toString()
      .replace(/[\D]/g, '')
      .replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
      .replace(/(-\d{1})(\d+?)/, '$1');

    return formatter;
  }
}
