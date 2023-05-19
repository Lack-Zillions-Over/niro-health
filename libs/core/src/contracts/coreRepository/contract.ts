import type { IRepositoryContract } from '@app/core/contracts/coreRepository/interface';
import type { CoreDatabaseContract } from '@app/core/contracts/coreDatabase';
import type { CoreEntityContract } from '@app/core/contracts/coreEntity';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { Type } from '@app/similarity-filter';

/**
 * @description The contract that provides methods for repositories.
 */
export abstract class RepositoryContract
  implements IRepositoryContract<CoreEntityContract>
{
  constructor(
    protected readonly database: CoreDatabaseContract<CoreEntityContract>,
  ) {}

  /**
   * @description This method is called before saving data to the database.
   */
  abstract beforeSave(data: CoreEntityContract): Promise<CoreEntityContract>;

  /**
   * @description This method is called before updating data in the database.
   */
  abstract beforeUpdate(
    beforeData: CoreEntityContract,
    nextData: RecursivePartial<CoreEntityContract>,
  ): Promise<CoreEntityContract>;

  /**
   * @description This method is called for create new data in the database.
   */
  abstract create(
    data: CoreEntityContract,
  ): Promise<CoreEntityContract | Error>;

  /**
   * @description This method is called for update data in the database.
   */
  abstract update(
    id: number | string,
    newData: RecursivePartial<CoreEntityContract>,
  ): Promise<CoreEntityContract | Error>;

  /**
   * @description This method is called for delete data in the database.
   */
  abstract delete(id: number | string): Promise<boolean | Error>;

  /**
   * @description This method is called for find data by id in the database.
   */
  abstract findById(id: number | string): Promise<CoreEntityContract | Error>;

  /**
   * @description This method is called for find all data in the database.
   */
  abstract findAll(
    skip?: number,
    limit?: number,
  ): Promise<CoreEntityContract[]>;

  /**
   * @description This method is called for find data by filter in the database.
   */
  abstract findBy(
    filter: RecursivePartial<CoreEntityContract>,
    similarity?: Type,
  ): Promise<CoreEntityContract[]>;
}
