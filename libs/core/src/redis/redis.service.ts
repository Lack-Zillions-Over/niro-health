import {
  INestApplication,
  Injectable,
  OnApplicationShutdown,
  Inject,
} from '@nestjs/common';
import ioredis from 'ioredis';

import type { IRedisService } from '@app/core/redis/redis.interface';
import type { IDebugService } from '@app/debug';
import type { IConfigurationService } from '@app/configuration';

/**
 * @description This service is used to interact with the Redis database.
 */
@Injectable()
export class RedisService implements IRedisService, OnApplicationShutdown {
  /**
   * @description This is instance of application.
   */
  app: INestApplication;

  /**
   * @description This is the major component of ioredis. Use it to connect to a standalone Redis server or Sentinels.
   */
  private _client: ioredis;

  /**
   * @description This is used to check if the environment variables from Redis are missing.
   */
  private _redisConfigurationFalsy = false;

  constructor(
    @Inject('IDebugService') private readonly debugService: IDebugService,
    @Inject('IConfigurationService')
    private readonly configurationService: IConfigurationService,
  ) {
    if (
      !this.configurationService.REDIS_HOST ||
      !this.configurationService.REDIS_PORT
    ) {
      this.debugService.error(
        'Environment variables from Redis are missing: REDIS_HOST, REDIS_PORT',
      );
      this._redisConfigurationFalsy = true;
    } else {
      this._client = new ioredis(this.configurationService.REDIS_HOST, {
        password: this.configurationService.REDIS_PASSWORD,
        port: this.configurationService.REDIS_PORT,
      });
    }
  }

  /**
   * @description Returns if environment variables from Redis are missing.
   */
  public get redisConfigurationFalsy(): boolean {
    return this._redisConfigurationFalsy;
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
   * @description It saves a key-value pair in the Redis database.
   * @param {string} key The key.
   * @param {string} value The value.
   * @return {Promise<boolean>} A promise that resolves to true if the key-value pair is saved.
   */
  public async save(key: string, value: string): Promise<boolean> {
    return (await this._client.set(key, value)) === 'OK' ? true : false;
  }

  /**
   * @description It saves a key-value pair in the Redis database.
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
   * @description It update a key-value pair in the Redis database.
   * @param {string} key The key.
   * @param {string} newValue The new value.
   * @return {Promise<boolean>} A promise that resolves to true if the key-value pair is updated.
   */
  public async update(key: string, newValue: string): Promise<boolean> {
    if (!(await this._client.get(key))) return false;

    return (await this._client.set(key, newValue)) === 'OK' ? true : false;
  }

  /**
   * @description It update a key-value pair in the Redis database.
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
   * @description It returns all the values in the Redis database.
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
   * @description It returns a value in the Redis database.
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
   * @description It delete a key-value pair in the Redis database.
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

  /**
   * @description This method is used to shutdown application.
   * @param {INestApplication} app The application instance.
   */
  public async shutdown(app: INestApplication) {
    const logger = this.debugService;
    try {
      await this._client.shutdown();
      logger.log('Redis connection is disconnected');
      await app.close();
    } catch (error) {
      return logger.error(error, `Redis connection has occurred error`);
    }
  }

  /**
   * @description This method is called before the application shutdown.
   */
  public async onApplicationShutdown() {
    return await this.shutdown(this.app);
  }

  /**
   * @description This method is used to enable shutdown hooks.
   * @param {INestApplication} app The application instance.
   */
  public async enableShutdownHooks(app: INestApplication) {
    this.app = app;
  }
}
