import { Inject, Injectable } from '@nestjs/common';

import { HypercContract } from './hyperc.interface';

import type { IRedisService } from '@app/core/redis/redis.interface';

/**
 * @description The module provides a simple way to cache data in Redis.
 */
@Injectable()
export class HypercService extends HypercContract {
  constructor(
    @Inject('IRedisService') private readonly redisService: IRedisService,
  ) {
    super();
  }

  /**
   * @description Returns the name expire of the cache serialized.
   * @param identifier The identifier of the cache
   */
  private _nameExpire(identifier: string | number): string {
    return `${this.serializeIdentifier(identifier)}-expire`;
  }

  /**
   * @description Returns the name key of the cache serialized.
   * @param identifier The identifier of the cache
   * @param key The key of the cache
   */
  private _nameKey(identifier: string | number, key: string): string {
    return `${this.serializeIdentifier(identifier)}-key-${key}`;
  }

  /**
   * @description Check if the cache is expired.
   * @param identifier The identifier of the cache
   */
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
   * @description Create a new cache with a ttl in milliseconds (ms).
   * @param identifier The identifier of the cache
   * @param ttl The time to live of the cache in milliseconds (ms)
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
   * @description Set a new value in the cache.
   * @param identifier The identifier of the cache
   * @param key The key of the cache
   * @param value The value of the cache
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
   * @description Get a value from the cache.
   * @param identifier The identifier of the cache
   * @param key The key of the cache
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
   * @description Delete a value from the cache.
   * @param identifier The identifier of the cache
   * @param key The key of the cache
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
   * @description Delete all values from the cache.
   * @param identifier The identifier of the cache
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
   * @description Delete all values from all caches.
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
