import type { INestApplication } from '@nestjs/common';
import type { PrivateKey } from '@app/private-keys/entities';
import type { ISimilarityFilterService, Type } from '@app/similarity-filter';

import { PrivateKeyDatabaseContract } from '@app/private-keys/contracts';

import * as _ from 'lodash';

export class PrivateKeyMemoryDB extends PrivateKeyDatabaseContract {
  private readonly _similarityFilterService: ISimilarityFilterService;

  constructor(
    protected readonly app: INestApplication,
    protected keys: PrivateKey[],
  ) {
    super(app);
    this._similarityFilterService = this.app.get<ISimilarityFilterService>(
      'ISimilarityFilterService',
    );
  }

  async create(data: PrivateKey): Promise<PrivateKey> {
    this.keys.push(data);

    return data;
  }

  async findAll(limit?: number, offset?: number): Promise<PrivateKey[]> {
    return this.keys.slice(offset || 0, limit || this.keys.length);
  }

  async findOne(id: number | string): Promise<PrivateKey | null> {
    return this.keys.find((key) => key.id === id);
  }

  async findBy(
    filter: Partial<PrivateKey>,
    similarity?: Type,
  ): Promise<PrivateKey[]> {
    return this.keys.filter((key) =>
      this._similarityFilterService.execute<PrivateKey>(
        filter,
        key as PrivateKey,
        similarity || 'full',
      ),
    ) as PrivateKey[];
  }

  async findByTag(tag: string): Promise<PrivateKey | null> {
    return this.keys.find((key) => key.tag === tag);
  }

  async update(
    id: number | string,
    newData: PrivateKey,
  ): Promise<PrivateKey | null> {
    this.keys = this.keys.map((key) =>
      key.id === id ? { ...key, ..._.omitBy(newData, _.isNil) } : key,
    ) as PrivateKey[];

    return this.findOne(id);
  }

  async delete(id: number | string): Promise<boolean> {
    this.keys = this.keys.filter((key) => key.id !== id);

    return true;
  }
}
