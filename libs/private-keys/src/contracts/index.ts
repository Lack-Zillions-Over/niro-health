import { CoreDatabaseContract } from '@app/core/contracts/coreDatabase';
import { PrivateKey } from '@app/private-keys/entities';

export abstract class PrivateKeyDatabaseContract extends CoreDatabaseContract<PrivateKey> {
  abstract findByTag(tag: string): Promise<PrivateKey | null>;

  public generateValue(): string {
    return this._randomService.hash(256, 'hex');
  }
}
