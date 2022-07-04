import { CoreDatabaseContract } from '../../core/contracts/core-database.contract';
import { User } from '../entities/users.entity';

export abstract class UserDatabaseContract extends CoreDatabaseContract<User> {
  abstract findByUsername(username: string): Promise<User | never>;
  abstract findByEmail(email: string): Promise<User | never>;
}
