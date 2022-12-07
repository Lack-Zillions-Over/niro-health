import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';
import { RecursivePartial } from '@/core/common/types/recursive-partial.type';

export declare namespace CoreRepository {
  export interface Class<Model> {
    beforeSave(data: Model): Promise<Model>;
    beforeUpdate(beforeData: Model, nextData: Partial<Model>): Promise<Model>;
    encrypt(data: string): Promise<string>;
    decrypt(data: string): Promise<string>;
    register(data: Model): Promise<Model | Error>;
    findMany(limit?: number, offset?: number): Promise<Model[]>;
    findBy(
      filter: RecursivePartial<Model>,
      similarity?: SimilarityFilterTypes.SimilarityType,
    ): Promise<Model[]>;
    findById(id: string): Promise<Model | Error>;
    update(id: string, newData: Partial<Model>): Promise<Model | Error>;
    remove(id: string): Promise<boolean | Error>;
    createdAt(): Date;
    updatedAt(): Date;
    deletedAt(): Date;
  }
}
