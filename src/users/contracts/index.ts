import { CoreDatabaseContract } from '@/core/contracts/coreDatabase';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';
import { User } from '@/users/entities';

export abstract class UserDatabaseContract extends CoreDatabaseContract<User> {
  constructor(
    protected readonly libsService: LibsService,
    protected readonly utilsService: UtilsService,
  ) {
    super(libsService, utilsService);
  }

  abstract findByEmail(email: string): Promise<User | null>;
}
