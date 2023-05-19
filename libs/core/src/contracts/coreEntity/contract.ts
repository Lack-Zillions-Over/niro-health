import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { ICoreEntityContract } from '@app/core/contracts/coreEntity/interface';

/**
 * @description The contract that provides methods for entities.
 */
export abstract class CoreEntityContract
  implements ICoreEntityContract<CoreEntityContract>
{
  /**
   * @description Unique identifier for the entity.
   */
  public readonly id: string | number;

  /**
   * @description Status of the entity. 1 = enable, 0 = disable.
   */
  public status: number;

  /**
   * @description Expired status of the entity. true = expired, false = not expired.
   */
  public expired: boolean;

  /**
   * @description Deleted status of the entity. true = deleted, false = not deleted.
   */
  public deleted: boolean;

  /**
   * @description Date when the entity was created.
   */
  public createdAt: Date;

  /**
   * @description Date when the entity was updated.
   */
  public updatedAt: Date;

  /**
   * @description Date when the entity was expired.
   */
  public expiredAt?: Date;

  /**
   * @description Date when the entity was deleted.
   */
  public deletedAt?: Date;

  constructor(data: Partial<CoreEntityContract>) {
    this.id = data?.id;
    this.status = data?.status || 1;
    this.deleted = data?.deleted || false;
    this.createdAt = data?.createdAt || this.now;
    this.updatedAt = data?.updatedAt || this.now;
    this.expiredAt = data?.expiredAt;
    this.deletedAt = data?.deletedAt;
  }

  /**
   * @description Get current date.
   */
  private get now() {
    return new Date();
  }

  /**
   * @description Set status to enable, 1 = enable.
   */
  public enable(): void {
    this.status = 1;
  }

  /**
   * @description Set status to disable, 0 = disable.
   */
  public disable(): void {
    this.status = 0;
  }

  /**
   * @description Set expired to true and set expiredAt to current date.
   */
  public expire(): void {
    this.expired = true;
    this.setExpiredAt(this.now);
  }

  /**
   * @description Set deleted to true and set deletedAt to current date.
   */
  public delete(): void {
    this.deleted = true;
    this.setDeletedAt(this.now);
  }

  /**
   * @description Set expired to false and set expiredAt to null.
   */
  public unExpire(): void {
    this.expired = false;
    this.setExpiredAt = null;
  }

  /**
   * @description Set deleted to false and set deletedAt to null.
   */
  public unDelete(): void {
    this.deleted = false;
    this.setDeletedAt = null;
  }

  /**
   * @description Check if status is enable, 1 = enable.
   */
  public isEnable(): boolean {
    return this.status === 1;
  }

  /**
   * @description Check if status is disable, 0 = disable.
   */
  public isDisable(): boolean {
    return this.status === 0;
  }

  /**
   * @description Check if expired is true. true = expired.
   */
  public isExpired(): boolean {
    return this.expired === true;
  }

  /**
   * @description Check if deleted is true. true = deleted.
   */
  public isDeleted(): boolean {
    return this.deleted === true;
  }

  /**
   * @description Check if expired is false. false = not expired.
   */
  public isNotExpired(): boolean {
    return this.expired === false;
  }

  /**
   * @description Check if deleted is false. false = not deleted.
   */
  public isNotDeleted(): boolean {
    return this.deleted === false;
  }

  /**
   * @description Get createdAt date.
   */
  public getCreatedAt(): Date {
    return this.createdAt;
  }

  /**
   * @description Get updatedAt date.
   */
  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  /**
   * @description Get expiredAt date.
   */
  public getExpiredAt(): Date {
    return this.expiredAt;
  }

  /**
   * @description Get deletedAt date.
   */
  public getDeletedAt(): Date {
    return this.deletedAt;
  }

  /**
   * @description Set createdAt date.
   */
  public setCreatedAt(date: Date): void {
    this.createdAt = date;
  }

  /**
   * @description Set updatedAt date.
   */
  public setUpdatedAt(date: Date): void {
    this.updatedAt = date;
  }

  /**
   * @description Set expiredAt date.
   */
  public setExpiredAt(date: Date): void {
    this.expiredAt = date;
  }

  /**
   * @description Set deletedAt date.
   */
  public setDeletedAt(date: Date): void {
    this.deletedAt = date;
  }

  /**
   * @description Get entity properties.
   */
  public get(): RecursivePartial<CoreEntityContract> {
    return {
      id: this.id,
      status: this.status,
      deleted: this.deleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      expiredAt: this.expiredAt,
      deletedAt: this.deletedAt,
    };
  }
}
