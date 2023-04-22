import type { INestApplication } from '@nestjs/common';
import type { File } from '@app/files/entities';
import type { ISimilarityFilterService, Type } from '@app/similarity-filter';

import { FileDatabaseContract } from '@app/files/contracts';

import * as _ from 'lodash';

export class FileMemoryDB extends FileDatabaseContract {
  private readonly _similarityFilterService: ISimilarityFilterService;

  constructor(
    protected readonly app: INestApplication,
    private files: File[] = [],
  ) {
    super(app);
    this._similarityFilterService = this.app.get<ISimilarityFilterService>(
      'ISimilarityFilterService',
    );
  }

  async create(data: File): Promise<File> {
    this.files.push(data);

    return data;
  }

  async findAll(limit?: number, skip?: number): Promise<File[]> {
    return this.files.slice(skip || 0, limit || this.files.length);
  }

  async findOne(id: number | string): Promise<File | null> {
    return this.files.find((file) => file.id === id);
  }

  async findBy(filter: Partial<File>, similarity?: Type): Promise<File[]> {
    return this.files.filter((key) =>
      this._similarityFilterService.execute<File>(
        filter,
        key as File,
        similarity || 'full',
      ),
    ) as File[];
  }

  async findByName(name: string): Promise<File[]> {
    return this.files.filter((file) => file.name === name);
  }

  async findByVersion(name: string, version: number): Promise<File> {
    return this.files.find(
      (file) => file.name === name && file.version === version,
    );
  }

  async findByTag(tag: string): Promise<File[]> {
    return this.files.filter((file) => file.tags.includes(tag));
  }

  async findByAuthorId(authorId: string): Promise<File[]> {
    return this.files.filter((file) => file.authorId === authorId);
  }

  async findByTemporary(): Promise<File[]> {
    return this.files.filter((file) => file.temporary);
  }

  async update(id: number | string, newData: File): Promise<File | null> {
    this.files = this.files.map((file) =>
      file.id === id ? { ...file, ..._.omitBy(newData, _.isNil) } : file,
    ) as File[];

    return await this.findOne(id);
  }

  async removeVersion(name: string, version: number): Promise<boolean> {
    this.files = this.files.filter(
      (file) => file.name !== name && file.version !== version,
    );

    return true;
  }

  async delete(id: number | string): Promise<boolean> {
    this.files = this.files.filter((File) => File.id !== id);

    return true;
  }
}
