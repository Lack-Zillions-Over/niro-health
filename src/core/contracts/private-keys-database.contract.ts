import { CoreDatabaseContract } from './core-database.contract';
import { PrivateKey } from '../entities/private-keys.entity';
import { Random } from '../utils/random.util';

export abstract class PrivateKeyDatabaseContract extends CoreDatabaseContract<PrivateKey> {
  public generateValue() {
    return Random.HASH(256, 'hex');
  }

  abstract findByTag(tag: string): Promise<PrivateKey | never>;
}
