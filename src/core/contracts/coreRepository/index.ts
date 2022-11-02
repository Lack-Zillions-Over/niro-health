import { CoreRepository } from '@/core/contracts/coreRepository/types';

import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';
import { RecursivePartial } from '@/core/common/types/recursive-partial.type';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export abstract class RepositoryContract<Model, ModelDatabaseContract>
  implements CoreRepository.Class<Model>
{
  constructor(
    protected readonly database: ModelDatabaseContract,
    protected readonly libsService: LibsService,
    protected readonly utilsService: UtilsService,
  ) {}

  public createdAt() {
    return new Date();
  }

  public updatedAt() {
    return new Date();
  }

  public deletedAt() {
    return new Date();
  }

  abstract beforeSave(model: Model): Promise<Model>;
  abstract beforeUpdate(beforeData: Model, nextData: Model): Promise<Model>;
  abstract decryptFieldValue(value: string): Promise<string>;
  abstract register(model: Model): Promise<Model | Error>;
  abstract findMany(): Promise<Model[]>;
  abstract findBy(
    filter: RecursivePartial<Model>,
    similarity?: SimilarityFilterTypes.SimilarityType,
  ): Promise<Model[]>;
  abstract findById(id: string): Promise<Model | Error>;
  abstract update(id: string, newData: Model): Promise<Model | Error>;
  abstract remove(id: string): Promise<boolean | Error>;
}
