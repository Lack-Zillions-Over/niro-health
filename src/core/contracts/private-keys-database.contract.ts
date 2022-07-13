import { CoreDatabaseContract } from '@/core/contracts/core-database.contract';
import { PrivateKey } from '@/core/entities/private-keys.entity';
import { Random } from '@/core/utils/random.util';

export abstract class PrivateKeyDatabaseContract extends CoreDatabaseContract<PrivateKey> {
  public generateValue() {
    return Random.HASH(256, 'hex');
  }

  abstract findByTag(tag: string): Promise<PrivateKey | never>;
}
