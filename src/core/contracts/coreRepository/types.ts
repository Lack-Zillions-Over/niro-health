import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';
import { RecursivePartial } from '@/core/common/types/recursive-partial.type';

export declare namespace CoreRepository {
  export interface Class<Model> {
    createdAt(): Date;
    updatedAt(): Date;
    deletedAt(): Date;
    beforeSave(model: Model): Promise<Model>;
    beforeUpdate(beforeData: Model, nextData: Model): Promise<Model>;
    decryptFieldValue(value: string): Promise<string>;
    register(model: Model): Promise<Model | Error>;
    findMany(): Promise<Model[]>;
    findBy(
      filter: RecursivePartial<Model>,
      similarity?: SimilarityFilterTypes.SimilarityType,
    ): Promise<Model[]>;
    findById(id: string): Promise<Model | Error>;
    update(id: string, newData: Model): Promise<Model | Error>;
    remove(id: string): Promise<boolean | Error>;
  }
}
