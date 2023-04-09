import { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import { CoreEntity } from '@app/core/contracts/coreEntity/types';

export abstract class CoreEntityContract
  implements CoreEntity.Class<CoreEntityContract>
{
  public readonly id: string | number;
  public status: number;
  public expired: boolean;
  public deleted: boolean;
  public createdAt: Date;
  public updatedAt: Date;
  public expiredAt?: Date;
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

  private get now() {
    return new Date();
  }

  enable(): void {
    this.status = 1;
  }

  disable(): void {
    this.status = 0;
  }

  expire(): void {
    this.expired = true;
    this.setExpiredAt(this.now);
  }

  delete(): void {
    this.deleted = true;
    this.setDeletedAt(this.now);
  }

  unExpire(): void {
    this.expired = false;
    this.setExpiredAt = null;
  }

  unDelete(): void {
    this.deleted = false;
    this.setDeletedAt = null;
  }

  isEnable(): boolean {
    return this.status === 1;
  }

  isDisable(): boolean {
    return this.status === 0;
  }

  isExpired(): boolean {
    return this.expired === true;
  }

  isDeleted(): boolean {
    return this.deleted === true;
  }

  isNotExpired(): boolean {
    return this.expired === false;
  }

  isNotDeleted(): boolean {
    return this.deleted === false;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getExpiredAt(): Date {
    return this.expiredAt;
  }

  getDeletedAt(): Date {
    return this.deletedAt;
  }

  setCreatedAt(date: Date): void {
    this.createdAt = date;
  }
  setUpdatedAt(date: Date): void {
    this.updatedAt = date;
  }

  setExpiredAt(date: Date): void {
    this.expiredAt = date;
  }

  setDeletedAt(date: Date): void {
    this.deletedAt = date;
  }

  get(): RecursivePartial<CoreEntityContract> {
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
