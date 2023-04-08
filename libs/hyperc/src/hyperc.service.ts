import { Injectable } from '@nestjs/common';

import HypercContract from '@app/hyperc/hyperc.contract';

import { RedisService } from '@app/redis';

@Injectable()
export class HypercService extends HypercContract {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  private _nameExpire(identifier: string | number): string {
    return `${this.serializeIdentifier(identifier)}-expire`;
  }

  private _nameKey(identifier: string | number, key: string): string {
    return `${this.serializeIdentifier(identifier)}-key-${key}`;
  }

  private async _isExpired(identifier: string | number): Promise<boolean> {
    try {
      const expire = await this.redisService.findOne(
        this._nameExpire(identifier),
      );
      return expire ? Date.now() > Number(expire) : true;
    } catch (e) {
      return true;
    }
  }

  /**
   * @description Create a new cache with a ttl in milliseconds (ms)
   * @returns false if the cache already exists
   * @returns true if the cache is created
   */
  public async create(
    identifier: string | number,
    ttl: number,
  ): Promise<boolean> {
    try {
      await this.redisService.save(
        this._nameExpire(identifier),
        String(Date.now() + ttl),
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * @description Set a new value in the cache
   * @returns false if the cache is expired
   * @returns true if the value is set
   */
  public async set<T>(
    identifier: string | number,
    key: string,
    value: T,
  ): Promise<boolean> {
    try {
      const isExpired = await this._isExpired(identifier);

      if (isExpired) {
        await this.flush(identifier);
        return false;
      }

      await this.redisService.save(
        this._nameKey(identifier, key),
        this.compress<T>(value),
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * @description Get a value from the cache
   * @returns null if the cache is expired or the value is not found
   */
  public async get<T>(
    identifier: string | number,
    key: string,
  ): Promise<T | null> {
    try {
      const isExpired = await this._isExpired(identifier);

      if (isExpired) {
        await this.flush(identifier);
        return null;
      }

      const value = await this.redisService.findOne(
        this._nameKey(identifier, key),
      );
      return this.decompress<T>(value as string);
    } catch (e) {
      return null;
    }
  }

  /**
   * @description Delete a value from the cache
   * @returns false if the cache is expired or the value is not found
   * @returns true if the value is deleted
   */
  public async del(identifier: string | number, key: string): Promise<boolean> {
    try {
      await this.redisService.delete(this._nameKey(identifier, key));
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * @description Delete all values from the cache
   * @returns false if the cache is expired or the value is not found
   */
  public async flush(identifier: string | number): Promise<boolean> {
    try {
      const keys = await this.redisService.keys(
        `${this.serializeIdentifier(identifier)}-*`,
      );
      for await (const key of keys) await this.redisService.delete(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * @description Delete all values from all caches
   * @returns false if the cache is expired or the value is not found
   * @returns true if the value is deleted
   */
  public async flushAll(): Promise<boolean> {
    try {
      await this.redisService.flushall();
      return true;
    } catch (e) {
      return false;
    }
  }
}
