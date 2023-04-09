import { RecursivePartial } from '@app/core/common/types/recursive-partial.type';

export declare namespace CoreEntity {
  export interface Class<Model> {
    enable(): void;
    disable(): void;
    expire(): void;
    delete(): void;
    unExpire(): void;
    unDelete(): void;
    isEnable(): boolean;
    isDisable(): boolean;
    isExpired(): boolean;
    isDeleted(): boolean;
    isNotExpired(): boolean;
    isNotDeleted(): boolean;
    getCreatedAt(): Date;
    getUpdatedAt(): Date;
    getExpiredAt(): Date;
    getDeletedAt(): Date;
    setCreatedAt(date: Date): void;
    setUpdatedAt(date: Date): void;
    setExpiredAt(date: Date): void;
    setDeletedAt(date: Date): void;
    get(): RecursivePartial<Model>;
  }
}
