import { CoreDatabaseContract } from '@app/core/contracts/coreDatabase';
import type { File } from '@app/files/entities';

export abstract class FileDatabaseContract extends CoreDatabaseContract<File> {
  abstract findByName(name: string): Promise<File[]>;
  abstract findByVersion(name: string, version: number): Promise<File | null>;
  abstract findByTag(tag: string): Promise<File[]>;
  abstract findByAuthorId(authorId: string): Promise<File[]>;
  abstract findByTemporary(): Promise<File[]>;
  abstract removeVersion(name: string, version: number): Promise<boolean>;
}
