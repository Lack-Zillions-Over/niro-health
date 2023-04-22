import type { INestApplication } from '@nestjs/common';
import { FileDatabaseContract } from '@app/files/contracts';
import { RepositoryContract } from '@app/core/contracts/coreRepository';
import { File } from '@app/files/entities';
import type { EntityWithRelation } from '@app/files/types/entityWithRelation';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { Type } from '@app/similarity-filter';

import * as moment from 'moment';

export class FileRepository extends RepositoryContract {
  constructor(
    protected readonly database: FileDatabaseContract,
    protected readonly app: INestApplication,
  ) {
    super(database);
  }

  private async _getNextVersion(file: File): Promise<File> {
    const version = (
      await this.database.findBy({
        authorId: file.authorId,
        name: file.name,
        mimetype: file.mimetype,
      })
    )
      .map((file) => file.version)
      .sort((a, b) => a - b)
      .pop();

    file.version = version ? version + 1 : 1;

    return file;
  }

  public async _verifyIsTemporary(file: File): Promise<File> {
    if (file.temporary) file.expiredAt = moment().add(1, 'day').toDate();

    return file;
  }

  public async beforeSave(model: File): Promise<File> {
    model = await this._getNextVersion(model);
    model = await this._verifyIsTemporary(model);

    return model;
  }

  public async beforeUpdate(
    beforeData: File,
    nextData: RecursivePartial<File>,
  ): Promise<File> {
    return { ...beforeData, ...nextData } as File;
  }

  public async create(model: File): Promise<EntityWithRelation | Error> {
    model = await this.beforeSave(model);
    return (await this.database.create(model)) as EntityWithRelation;
  }

  public async findAll(
    limit?: number,
    skip?: number,
  ): Promise<EntityWithRelation[]> {
    return (await this.database.findAll(limit, skip)) as EntityWithRelation[];
  }

  public async findBy(
    filter: RecursivePartial<EntityWithRelation>,
    similarity?: Type,
  ): Promise<EntityWithRelation[]> {
    return (await this.database.findBy(
      filter,
      similarity,
    )) as EntityWithRelation[];
  }

  public async findById(id: string): Promise<EntityWithRelation | Error> {
    const file = await this.database.findOne(id);

    return file ? (file as EntityWithRelation) : new Error('File not found');
  }

  public async findByTemporary(): Promise<EntityWithRelation[]> {
    return (await this.database.findBy({
      temporary: true,
    })) as EntityWithRelation[];
  }

  public async update(
    id: string,
    newData: RecursivePartial<File>,
  ): Promise<EntityWithRelation | Error> {
    const file = await this.findById(id);

    if (file instanceof Error) return file;

    return (await this.database.update(
      id,
      await this.beforeUpdate(file, newData),
    )) as EntityWithRelation;
  }

  public async delete(id: string): Promise<boolean | Error> {
    return (await this.database.delete(id))
      ? true
      : new Error('File not found');
  }
}
