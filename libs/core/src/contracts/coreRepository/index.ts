import type { IRepositoryContract } from '@app/core/contracts/coreRepository/interface';
import type { CoreDatabaseContract } from '@app/core/contracts/coreDatabase';
import type { CoreEntityContract } from '@app/core/contracts/coreEntity';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { Type } from '@app/similarity-filter';

export abstract class RepositoryContract
  implements IRepositoryContract<CoreEntityContract>
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
    similarity?: Type,
  ): Promise<CoreEntityContract[]>;
}
