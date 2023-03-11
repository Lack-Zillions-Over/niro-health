import { createHash } from 'crypto';
import { compress, decompress } from 'lzutf8';
import Redis from 'ioredis';

abstract class HypercContract {
  protected client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL, {
      password: process.env.REDIS_PASSWORD,
      port: parseInt(process.env.REDIS_PORT),
    });
  }

  protected serializeIdentifier(identifier: string | number) {
    return createHash('sha256').update(identifier.toString()).digest('hex');
  }

  protected compress<T>(value: T): string {
    return compress(JSON.stringify(value), { outputEncoding: 'Base64' });
  }

  protected decompress<T>(value: string): T {
    return JSON.parse(
      decompress(value, { inputEncoding: 'Base64', outputEncoding: 'String' }),
    );
  }

  public abstract create(
    identifier: string | number,
    ttl: number,
  ): Promise<boolean>;
  public abstract set<T>(
    identifier: string | number,
    key: string,
    value: T,
  ): Promise<boolean>;
  public abstract get<T>(identifier: string | number, key: string): Promise<T>;
  public abstract del(
    identifier: string | number,
    key: string,
  ): Promise<boolean>;
  public abstract flush(identifier: string | number): Promise<boolean>;
  public abstract flushAll(): Promise<boolean>;
}

export default HypercContract;
