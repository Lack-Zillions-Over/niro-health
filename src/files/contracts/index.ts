import { CoreDatabaseContract } from '@/core/contracts/coreDatabase';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';
import { File } from '@/files/entities';

export abstract class FileDatabaseContract extends CoreDatabaseContract<File> {
  constructor(
    protected readonly libsService: LibsService,
    protected readonly utilsService: UtilsService,
  ) {
    super(libsService, utilsService);
  }

  abstract findByName(name: string): Promise<File[]>;
  abstract findByVersion(name: string, version: number): Promise<File | null>;
  abstract findByTag(tag: string): Promise<File[]>;
  abstract findByAuthorId(authorId: string): Promise<File[]>;
  abstract findByTemporary(): Promise<File[]>;
  abstract removeVersion(name: string, version: number): Promise<boolean>;
}
