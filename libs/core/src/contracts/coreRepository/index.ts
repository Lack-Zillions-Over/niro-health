import { CoreRepository } from '@app/core/contracts/coreRepository/types';
import { CoreDatabaseContract } from '@app/core/contracts/coreDatabase';
import { CoreEntityContract } from '@app/core/contracts/coreEntity';
import { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import { SimilarityFilter } from '@app/similarity-filter/similarity-filter.interface';

export abstract class RepositoryContract
  implements CoreRepository.Class<CoreEntityContract>
{
  constructor(
    protected readonly database: CoreDatabaseContract<CoreEntityContract>,
  ) {}

  abstract beforeSave(data: CoreEntityContract): Promise<CoreEntityContract>;

  abstract beforeUpdate(
    beforeData: CoreEntityContract,
    nextData: RecursivePartial<CoreEntityContract>,
  ): Promise<CoreEntityContract>;

  abstract create(
    data: CoreEntityContract,
  ): Promise<CoreEntityContract | Error>;

  abstract update(
    id: string,
    newData: RecursivePartial<CoreEntityContract>,
  ): Promise<CoreEntityContract | Error>;

  abstract delete(id: string): Promise<boolean | Error>;

  abstract findById(id: string): Promise<CoreEntityContract | Error>;

  abstract findAll(
    skip?: number,
    limit?: number,
  ): Promise<CoreEntityContract[]>;

  abstract findBy(
    filter: RecursivePartial<CoreEntityContract>,
    similarity?: SimilarityFilter.Type,
  ): Promise<CoreEntityContract[]>;
}
