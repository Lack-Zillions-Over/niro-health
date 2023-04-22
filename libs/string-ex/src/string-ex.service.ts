import { Injectable } from '@nestjs/common';

import { deflate, inflate } from 'pako';
import * as LZString from 'lz-string';
import * as Sugar from 'sugar';

import { createHash } from 'crypto';
import { hash, compare } from 'bcrypt';

import {
  IStringExService,
  CompressData,
  MaskPhoneType,
} from '@app/string-ex/string-ex.interface';

@Injectable()
export class StringExService implements IStringExService {
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
  public compress(data: CompressData) {
    if (
      !Buffer.isBuffer(data) ||
      data instanceof Uint8Array === false ||
      typeof data !== 'string'
    ) {
      data = JSON.stringify(data);
    }

    const base64 = Buffer.from(deflate(data)).toString('base64');

    return base64;
  }

  /**
   * @description Decompresses a string from base64 to {Type | string | Uint8Array | Buffer}
   */
  public decompress(encoded: string): CompressData {
    const exec = (run) => {
      try {
        return run();
      } catch {
        return false;
      }
    };
    const inflateToString = () =>
      inflate(new Uint8Array(Buffer.from(encoded, 'base64')), {
        to: 'string',
      });
    const base64FromJSON = () => JSON.parse(inflateToString());
    const base64FromPrimitive = () => inflateToString();

    const fromJSON = exec(base64FromJSON);
    const fromPrimitive = exec(base64FromPrimitive);

    if (fromJSON) return fromJSON;
    if (fromPrimitive) return fromPrimitive;

    return '???';
  }

  /**
   * @description Return hash from password
   */
  public async hashPassword(password: string, saltRounds?: number) {
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
   * @description Get name of file
   */
  public getFilename(name: string): string {
    return name.slice(0, name.lastIndexOf('.'));
  }

  /**
   * @description Get extension of file
   */
  getFileExtension(name: string): string {
    return name.slice(name.lastIndexOf('.'));
  }

  /**
   * @description Extract numbers from string
   */
  public extractNumbers(text: string): number[] {
    const regex = /\d+/g;
    const match = text.match(regex);
    const numbers = match.map(Number);
    return numbers;
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
  public maskPhone(value: string, type: MaskPhoneType): string {
    switch (type) {
      case 'cell':
        return value
          .toString()
          .replace(/\D/g, '')
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .replace(/(-\d{4})(\d+?)/, '$1');
      case 'tel':
      default:
        return value
          .toString()
          .replace(/\D/g, '')
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
      .replace(/\D/g, '')
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
      .replace(/\D/g, '')
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
      .replace(/\D/g, '')
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
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
      .replace(/(-\d{1})(\d+?)/, '$1');

    return formatter;
  }
}
