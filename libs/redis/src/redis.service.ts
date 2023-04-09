import { Injectable } from '@nestjs/common';
import ioredis from 'ioredis';

import { ConfigurationService } from '@app/configuration';
import { Redis } from '@app/redis/redis.interface';

@Injectable()
export class RedisService implements Redis.Class {
  private _client: ioredis;

  constructor(private readonly configurationService: ConfigurationService) {
    this._client = new ioredis(this.configurationService.REDIS_HOST, {
      password: this.configurationService.REDIS_PASSWORD,
      port: this.configurationService.REDIS_PORT,
    });
  }

  /**
   * @description Get all keys that match a pattern.
   * @param {string} pattern The pattern.
   * @return {Promise<string[]>} A promise that resolves to an array of keys.
   */
  public async keys(pattern: string): Promise<string[]> {
    return await this._client.keys(pattern);
  }

  /**
   * It saves a key-value pair in the Redis database.
   * @param {string} key The key.
   * @param {string} value The value.
   * @return {Promise<boolean>} A promise that resolves to true if the key-value pair is saved.
   */
  public async save(key: string, value: string): Promise<boolean> {
    return (await this._client.set(key, value)) === 'OK' ? true : false;
  }

  /**
   * It saves a key-value pair in the Redis database.
   * @param {string} key The key.
   * @param {Buffer} value The value.
   * @return {Promise<boolean>} A promise that resolves to true if the key-value pair is saved.
   */
  public async saveBuffer(key: string, value: Buffer): Promise<boolean> {
    return Buffer.isBuffer(await this._client.setBuffer(key, value, 'GET'))
      ? true
      : false;
  }

  /**
   * It update a key-value pair in the Redis database.
   * @param {string} key The key.
   * @param {string} newValue The new value.
   * @return {Promise<boolean>} A promise that resolves to true if the key-value pair is updated.
   */
  public async update(key: string, newValue: string): Promise<boolean> {
    if (!(await this._client.get(key))) return false;

    return (await this._client.set(key, newValue)) === 'OK' ? true : false;
  }

  /**
   * It update a key-value pair in the Redis database.
   * @param {string} key The key.
   * @param {Buffer} newValue The new value.
   * @return {Promise<boolean>} A promise that resolves to true if the key-value pair is updated.
   */
  public async updateBuffer(key: string, newValue: Buffer): Promise<boolean> {
    if (!(await this._client.getBuffer(key))) return false;

    return Buffer.isBuffer(await this._client.setBuffer(key, newValue, 'GET'))
      ? true
      : false;
  }

  /**
   * It returns all the values in the Redis database.
   * @return {Promise<Array<string | Buffer>>} A promise that resolves to an array of values.
   */
  public async findAll(): Promise<Array<string | Buffer>> {
    const keys = await this._client.keys('*');

    const values: Array<string | Buffer> = [];

    for (const key of keys) {
      const value = await this._client.get(key);
      const buffer = await this._client.getBuffer(key);

      if (value) {
        values.push(value);
      } else if (buffer) {
        values.push(buffer);
      }
    }

    return values;
  }

  /**
   * It returns a value in the Redis database.
   * @param {string} key The key.
   * @return {Promise<string | Buffer | null>} A promise that resolves to a value.
   */
  public async findOne(key: string): Promise<string | Buffer | null> {
    const value = await this._client.get(key);
    const buffer = await this._client.getBuffer(key);

    if (value) {
      return value;
    } else if (buffer) {
      return buffer;
    }

    return null;
  }

  /**
   * It delete a key-value pair in the Redis database.
   * @param {string} key The key.
   * @return {Promise<boolean>} A promise that resolves to true if the key-value pair is deleted.
   */
  public async delete(...keys: string[]): Promise<boolean> {
    return (await this._client.del(...keys)) > 0 ? true : false;
  }

  /**
   * @description Delete all the keys of all the existing databases, not just the currently selected one.
   * @return {Promise<'OK'>} A promise that resolves to 'OK'.
   */
  public async flushall(): Promise<'OK'> {
    return await this._client.flushall();
  }
}
