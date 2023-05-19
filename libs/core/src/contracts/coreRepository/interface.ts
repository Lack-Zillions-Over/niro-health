import type { Type } from '@app/similarity-filter/similarity-filter.interface';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';

export interface ICoreRepositoryContract<Model> {
  beforeSave(data: Model): Promise<Model>;
  beforeUpdate(
    beforeData: Model,
    nextData: RecursivePartial<Model>,
  ): Promise<Model>;
  create(data: Model): Promise<Model | Error>;
  update(
    id: number | string,
    newData: RecursivePartial<Model>,
  ): Promise<Model | Error>;
  delete(id: number | string): Promise<boolean | Error>;
  findById(id: number | string): Promise<Model | Error>;
  findAll(skip?: number, limit?: number): Promise<Model[]>;
  findBy(filter: RecursivePartial<Model>, similarity?: Type): Promise<Model[]>;
}
