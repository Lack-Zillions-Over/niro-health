import type { Type } from '@app/similarity-filter/similarity-filter.interface';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';

export interface IRepositoryContract<Model> {
  beforeSave(data: Model): Promise<Model>;
  beforeUpdate(
    beforeData: Model,
    nextData: RecursivePartial<Model>,
  ): Promise<Model>;
  create(data: Model): Promise<Model | Error>;
  update(id: string, newData: RecursivePartial<Model>): Promise<Model | Error>;
  delete(id: string): Promise<boolean | Error>;
  findById(id: string): Promise<Model | Error>;
  findAll(skip?: number, limit?: number): Promise<Model[]>;
  findBy(filter: RecursivePartial<Model>, similarity?: Type): Promise<Model[]>;
}
