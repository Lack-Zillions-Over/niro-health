import { FileDatabaseContract } from '@/files/contracts';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';
import { File } from '@/files/entities';

import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';

import * as _ from 'lodash';

export class FileMemoryDB extends FileDatabaseContract {
  constructor(
    protected readonly libsService: LibsService,
    protected readonly utilsService: UtilsService,
    protected files: File[],
  ) {
    super(libsService, utilsService);
  }

  async create(data: File): Promise<File> {
    this.files.push(data);

    return data;
  }

  async findAll(): Promise<File[]> {
    return this.files;
  }

  async findOne(id: string): Promise<File | null> {
    return this.files.find((file) => file.id === id);
  }

  async findBy(
    filter: Partial<File>,
    similarity?: SimilarityFilterTypes.SimilarityType,
  ): Promise<File[]> {
    return this.files.filter((key) =>
      this.utilsService
        .similarityFilter()
        .execute<File>(filter, key as File, similarity || 'full'),
    ) as File[];
  }

  async findByName(name: string): Promise<File[]> {
    return this.files.filter((file) => file.name === name);
  }

  async findByVersion(name: string, version: number): Promise<File> {
    return this.files.find(
      (file) => File.name === name && file.version === version,
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

  async update(id: string, newData: File): Promise<File | null> {
    this.files = this.files.map((file) =>
      file.id === id ? { ...file, ..._.omitBy(newData, _.isNil) } : file,
    );

    return this.findOne(id);
  }

  async removeVersion(name: string, version: number): Promise<boolean> {
    this.files = this.files.filter(
      (file) => file.name !== name && file.version !== version,
    );

    return true;
  }

  async remove(id: string): Promise<boolean> {
    this.files = this.files.filter((File) => File.id !== id);

    return true;
  }
}
