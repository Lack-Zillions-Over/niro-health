import { PrivateKeyDatabaseContract } from '@/privateKeys/contracts';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';
import { PrivateKey } from '@/privateKeys/entities';

import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';

import * as _ from 'lodash';

export class PrivateKeyMemoryDB extends PrivateKeyDatabaseContract {
  constructor(
    protected readonly libsService: LibsService,
    protected readonly utilsService: UtilsService,
    protected keys: PrivateKey[],
  ) {
    super(libsService, utilsService);
  }

  async create(data: PrivateKey): Promise<PrivateKey | null> {
    this.keys.push(data);

    return data;
  }

  async findAll(): Promise<PrivateKey[]> {
    return this.keys;
  }

  async findOne(id: string): Promise<PrivateKey | null> {
    return this.keys.find((key) => key.id === id);
  }

  async findBy(
    filter: Partial<PrivateKey>,
    similarity?: SimilarityFilterTypes.SimilarityType,
  ): Promise<PrivateKey[]> {
    return this.keys.filter((key) =>
      this.utilsService
        .similarityFilter()
        .execute<PrivateKey>(filter, key as PrivateKey, similarity || 'full'),
    ) as PrivateKey[];
  }

  async findByTag(tag: string): Promise<PrivateKey | null> {
    return this.keys.find((key) => key.tag === tag);
  }

  async update(id: string, newData: PrivateKey): Promise<PrivateKey | null> {
    this.keys = this.keys.map((key) =>
      key.id === id ? { ...key, ..._.omitBy(newData, _.isNil) } : key,
    );

    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    this.keys = this.keys.filter((key) => key.id !== id);

    return true;
  }
}
