import { Injectable } from '@nestjs/common';

import * as crypto from 'crypto';
import * as lzutf8 from 'lzutf8';
import Redis from 'ioredis';

import { Crypto } from '@app/crypto/crypto.interface';
import { RandomStringService } from '@app/random/random-string.service';

@Injectable()
export class CryptoService implements Crypto.Class {
  private _client: Redis;

  constructor(private readonly randomStringService: RandomStringService) {
    this._client = new Redis(process.env.REDIS_HOST, {
      password: process.env.REDIS_PASSWORD,
      port: parseInt(process.env.REDIS_PORT),
    });
  }

  /**
   * It takes a string, creates a hash of it, and returns the first 32 characters of
   * the hash
   * @param {string} data - The data to be hashed.
   * @returns A hash of the data.
   */
  private _createHash(data: string) {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('base64')
      .slice(0, 32);
  }

  /**
   * It creates a hash of a random string
   * @returns A hash of a random string.
   */
  private _getHash() {
    const hash = crypto.createHash('md5');
    hash.update(this.randomStringService.string(24));
    return hash.digest('hex');
  }

  /**
   * It takes a string, hashes it, and returns the hash
   * @param {string} text - The text to be hashed.
   * @returns A hash of the text.
   */
  private _serialize(text: string) {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  /**
   * It takes a value of type T, converts it to a string, compresses it, and returns
   * the compressed string
   * @param {T} value - The value to be compressed.
   * @returns A string
   */
  private _compress<T>(value: T): string {
    return lzutf8.compress(JSON.stringify(value), { outputEncoding: 'Base64' });
  }

  /**
   * It takes a string, decompresses it, and returns the result as a generic type
   * @param {string} value - The string to be compressed.
   * @returns The decompressed value.
   */
  private _decompress<T>(value: string): T {
    return JSON.parse(
      lzutf8.decompress(value, {
        inputEncoding: 'Base64',
        outputEncoding: 'String',
      }),
    );
  }

  /**
   * It saves a value to the cache
   * @param {string} key - The key to store the value under.
   * @param {string} value - The value to be stored in the cache.
   * @returns A promise that resolves to the value of the key.
   */
  private async _save(key: string, value: string) {
    return await this._client.set(this._serialize(key), this._compress(value));
  }

  /**
   * It saves a buffer to the cache
   * @param {string} key - The key to store the value under.
   * @param {Buffer} value - The value to be stored in the cache.
   * @returns A promise that resolves to a boolean value.
   */
  private async _saveBuffer(key: string, value: Buffer) {
    return await this._client.setBuffer(this._serialize(key), value, 'GET');
  }

  /**
   * It loads a value from the cache, decompresses it, and returns it
   * @param {string} key - The key to store the value under.
   * @returns The value of the key in the cache.
   */
  private async _load(key: string): Promise<string> {
    return this._decompress(await this._client.get(this._serialize(key)));
  }

  /**
   * It loads a buffer from the cache
   * @param {string} key - The key to store the value under.
   * @returns A promise that resolves to a buffer.
   */
  private async _loadBuffer(key: string): Promise<Buffer> {
    return await this._client.getBuffer(this._serialize(key));
  }

  /**
   * It takes a variable number of strings, serializes them, and then passes them to
   * the Redis client's `del` function
   * @param {string[]} key - The key to delete.
   * @returns The number of keys that were removed.
   */
  private async _delete(...key: string[]) {
    return await this._client.del(...key.map((k) => this._serialize(k)));
  }

  /**
   * It encrypts a string using a password and saves the encrypted string, the
   * initialization vector, and the authentication tag to the database
   * @param {string} txt - The text to be encrypted
   * @param {string} password - The password used to encrypt the data.
   * @returns The encrypted text
   */
  public async encrypt(
    txt: string,
    password: string = process.env.CRYPTO_PASSWORD,
  ) {
    if (typeof txt !== 'string')
      return 'Error in encrypt: txt must be a string';

    const config: Crypto.Config = {
        algorithm: 'aes-256-gcm',
        password,
        authTagLength: 16,
      },
      iv = this._createHash(this._getHash()),
      cipher = crypto.createCipheriv(
        config.algorithm,
        this._createHash(password || config.password),
        iv,
        { authTagLength: config.authTagLength },
      );

    let encrypted = cipher.update(txt, 'utf8', 'hex');

    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();
    const key = `${encrypted}-${password}`;

    await this._save(`${key}-iv`, iv);
    await this._saveBuffer(`${key}-tag`, tag);

    return encrypted;
  }

  /**
   * It decrypts the encrypted string using the password and the IV and the tag
   * @param {string} encrypted - The encrypted string
   * @param {string} password - The password used to encrypt the data.
   * @param {boolean} [del] - boolean - if true, the IV and tag will be deleted
   * from the cache.
   * @returns The decrypted text.
   */
  public async decrypt(
    encrypted: string,
    password: string = process.env.CRYPTO_PASSWORD,
    del?: boolean,
  ) {
    try {
      const key = `${encrypted}-${password}`;
      const keyIV = `${key}-iv`;
      const KeyTAG = `${key}-tag`;
      const iv = await this._load(keyIV);
      const tag = await this._loadBuffer(KeyTAG);

      if (del) await this._delete(keyIV, KeyTAG);

      const config: Crypto.Config = {
          algorithm: 'aes-256-gcm',
          password,
          authTagLength: 16,
        },
        decipher = crypto.createDecipheriv(
          config.algorithm,
          this._createHash(password || config.password),
          iv,
          { authTagLength: config.authTagLength },
        );

      decipher.setAuthTag(tag);

      let txt = decipher.update(encrypted, 'hex', 'utf8');

      txt += decipher.final('utf8');

      return txt;
    } catch (error) {
      return `Error ${error}`;
    }
  }
}
