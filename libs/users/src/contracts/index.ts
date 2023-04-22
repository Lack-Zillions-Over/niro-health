import { CoreDatabaseContract } from '@app/core/contracts/coreDatabase';
import type { User } from '@app/users/entities';

export abstract class UserDatabaseContract extends CoreDatabaseContract<User> {
  abstract findByEmail(email: string): Promise<User | null>;
}
