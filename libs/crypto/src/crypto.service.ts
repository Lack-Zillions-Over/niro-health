import { Injectable } from '@nestjs/common';

import * as crypto from 'crypto';
import * as lzutf8 from 'lzutf8';
import * as lzstring from 'lz-string';
import * as fs from 'fs';
import * as path from 'path';

import { ConfigurationService } from '@app/configuration';
import { RedisService } from '@app/redis';
import { SqliteService } from '@app/sqlite';
import { RandomStringService } from '@app/random';
import { Crypto } from '@app/crypto/crypto.interface';

@Injectable()
export class CryptoService implements Crypto.Class {
  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly redisService: RedisService,
    private readonly sqliteService: SqliteService,
    private readonly randomStringService: RandomStringService,
  ) {
    if (this._isSqlite) {
      this._createTable();
    }

    if (this._isFileSystem) {
      this._createFileSystem();
    }
  }

  private get _driver() {
    return (
      (this.configurationService.getVariable(
        'crypto_driver',
      ) as Crypto.Drive) ?? 'sqlite'
    );
  }

  private get _isRedis() {
    return this._driver === 'redis';
  }

  private get _isSqlite() {
    return this._driver === 'sqlite';
  }

  private get _isFileSystem() {
    return this._driver === 'fs';
  }

  /**
   * It create the table in the SQLite database
   * @returns A promise that resolves to 'OK'.
   * @throws {Error} If the table is not created.
   */
  private async _createTable() {
    return new Promise((resolve, reject) => {
      this.sqliteService.db.run(
        `CREATE TABLE IF NOT EXISTS crypto (
          key TEXT PRIMARY KEY,
          value BLOB
        )`,
        (err) => {
          if (err) {
            return reject(err);
          }

          return resolve('OK');
        },
      );
    });
  }

  private get _fileSystemPath() {
    return path.join(__dirname, 'crypto.data');
  }

  private get _fileSystemExistsData() {
    return fs.existsSync(this._fileSystemPath);
  }

  private get _fileSystemEncode(): fs.WriteFileOptions {
    return 'utf8';
  }

  private _fileSystemWrite(data: Record<string, Crypto.FileSystemData>) {
    fs.writeFileSync(
      this._fileSystemPath,
      lzstring.compressToBase64(JSON.stringify(data)),
      this._fileSystemEncode,
    );
  }

  private _fileSystemRead(): Record<string, Crypto.FileSystemData> {
    const data = lzstring.decompressFromBase64(
      fs.readFileSync(this._fileSystemPath, this._fileSystemEncode) as string,
    );

    return this._fileSystemDataParse(data);
  }

  private _fileSystemDataParse(data: string) {
    const parse = JSON.parse(data);

    for (const key in parse) {
      const item = parse[key];

      if (typeof item.value !== 'string' && item.value?.type === 'Buffer') {
        item.value = Buffer.from(item.value.data);
      }
    }

    return parse || {};
  }

  private _createFileSystem() {
    if (!this._fileSystemExistsData) {
      this._fileSystemWrite({});
    }
  }

  private _fileSystemAppend(item: Crypto.FileSystemData) {
    const data = this._fileSystemRead();
    data[item.key] = item;
    this._fileSystemWrite(data);
  }

  private _fileSystemFind(key: string): Crypto.FileSystemData | undefined {
    const data = this._fileSystemRead();
    return data[key];
  }

  private _fileSystemDelete(key: string) {
    const data = this._fileSystemRead();
    delete data[key];
    this._fileSystemWrite(data);
  }

  /**
   * It inserts a key and a value in the SQLite database
   * @param {string} key - The key to be inserted.
   * @param {string | Buffer} value - The value to be inserted.
   * @returns A promise that resolves to 'OK'.
   * @throws {Error} If the key is not inserted.
   */
  private async _insert(key: string, value: string | Buffer) {
    return new Promise((resolve, reject) => {
      if (this._isSqlite) {
        this.sqliteService.db.run(
          `INSERT INTO crypto (key, value) VALUES (?, ?)`,
          [key, value],
          (err) => {
            if (err) {
              return reject(err);
            }

            return resolve('OK');
          },
        );
      } else if (this._isFileSystem) {
        this._fileSystemAppend({
          key,
          value,
        });
        return resolve('OK');
      }
    });
  }

  /**
   * It find a key in the SQLite database
   * @param {string} key - The key to be found.
   * @returns A promise that resolves to the value of the key.
   * @throws {Error} If the key is not found.
   */
  private async _find(key: string) {
    return new Promise((resolve, reject) => {
      if (this._isSqlite) {
        this.sqliteService.db.get(
          `SELECT value FROM crypto WHERE key = ?`,
          [key],
          (err, row) => {
            const { value } = <{ value: string | Buffer }>row;

            if (err) {
              return reject(err);
            }

            return resolve(value);
          },
        );
      } else if (this._isFileSystem) {
        const data = this._fileSystemFind(key);
        if (!data) {
          return reject(new Error(`Key ${key} not found`));
        }
        return resolve(data.value);
      }
    });
  }

  /**
   * It deletes a key from the database
   * @param {string} key - The key to be deleted.
   * @returns A promise that resolves to 'OK' if the key was deleted successfully.
   */
  private async _del(...keys: string[]) {
    return new Promise((resolve, reject) => {
      if (this._isSqlite) {
        this.sqliteService.db.run(
          `DELETE FROM crypto WHERE key IN (${keys.map(() => '?').join(',')})`,
          keys,
          (err) => {
            if (err) {
              return reject(err);
            }

            return resolve('OK');
          },
        );
      } else if (this._isFileSystem) {
        keys.forEach((key) => this._fileSystemDelete(key));
        return resolve('OK');
      }
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
    key = this._serialize(key);
    value = this._compress(value);

    if (this._isRedis) {
      return await this.redisService.save(key, value);
    } else if (this._isFileSystem || this._isSqlite) {
      return await this._insert(key, value);
    }
  }

  /**
   * It saves a buffer to the cache
   * @param {string} key - The key to store the value under.
   * @param {Buffer} value - The value to be stored in the cache.
   * @returns A promise that resolves to a boolean value.
   */
  private async _saveBuffer(key: string, value: Buffer) {
    key = this._serialize(key);

    if (this._isRedis) {
      return await this.redisService.saveBuffer(key, value);
    } else if (this._isFileSystem || this._isSqlite) {
      return await this._insert(key, value);
    }
  }

  /**
   * It loads a value from the cache, decompresses it, and returns it
   * @param {string} key - The key to store the value under.
   * @returns The value of the key in the cache.
   */
  private async _load(key: string): Promise<string> {
    key = this._serialize(key);

    if (this._isRedis) {
      return this._decompress((await this.redisService.findOne(key)) as string);
    } else if (this._isFileSystem || this._isSqlite) {
      return this._decompress((await this._find(key)) as string);
    }
  }

  /**
   * It loads a buffer from the cache
   * @param {string} key - The key to store the value under.
   * @returns A promise that resolves to a buffer.
   */
  private async _loadBuffer(key: string): Promise<Buffer> {
    key = this._serialize(key);

    if (this._isRedis) {
      return (await this.redisService.findOne(key)) as Buffer;
    } else if (this._isFileSystem || this._isSqlite) {
      return (await this._find(key)) as Buffer;
    }
  }

  /**
   * It takes a variable number of strings, serializes them, and then passes them to
   * the Redis client's `del` function
   * @param {string[]} key - The key to delete.
   * @returns The number of keys that were removed.
   */
  private async _delete(...keys: string[]) {
    keys = keys.map((k) => this._serialize(k));

    if (this._isRedis) {
      return await this.redisService.delete(...keys);
    } else if (this._isFileSystem || this._isSqlite) {
      return await this._del(...keys);
    }
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
    password: string = this.configurationService.CRYPTO_PASSWORD,
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
    password: string = this.configurationService.CRYPTO_PASSWORD,
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
