import { CoreDatabaseContract } from '@/core/contracts/coreDatabase';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';
import { PrivateKey } from '@/privateKeys/entities';

export abstract class PrivateKeyDatabaseContract extends CoreDatabaseContract<PrivateKey> {
  constructor(
    protected readonly libsService: LibsService,
    protected readonly utilsService: UtilsService,
  ) {
    super(libsService, utilsService);
  }

  public generateValue() {
    return this.utilsService.random().hash(256, 'hex');
  }

  abstract findByTag(tag: string): Promise<PrivateKey | null>;
}
