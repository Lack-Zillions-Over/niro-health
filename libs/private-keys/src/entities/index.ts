import { CoreEntityContract } from '@app/core/contracts/coreEntity';

export class PrivateKey extends CoreEntityContract {
  tag: string;
  secret: string;
  value: string;

  constructor(data: Partial<PrivateKey>) {
    super(data);
    this.tag = data?.tag;
    this.secret = data?.secret;
    this.value = data?.value;
  }
}
