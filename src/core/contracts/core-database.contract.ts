import { Crypto, Encrypted } from '../libs/crypto.lib';
import { StringEx } from '../utils/string-ex.util';
import { Random } from '../utils/random.util';

export abstract class CoreDatabaseContract<Model> {
  public generateID() {
    return Random.UUID();
  }

  public hashByText(text: string) {
    return StringEx.Hash(text, 'sha1', 'hex');
  }

  public compareHashText(text: string, hashed: string) {
    return this.hashByText(text) === hashed;
  }

  public async hashByPassword(password: string) {
    return await StringEx.HashByPassword(password);
  }

  public async compareHashPassword(password: string, hashed: string) {
    return await StringEx.compareHashPassword(password, hashed);
  }

  public encrypt(data: string): string {
    return StringEx.Compress(JSON.stringify(Crypto.Encrypt(data)));
  }

  public decrypt(data: string): Encrypted {
    return StringEx.Decompress<Encrypted>(data) as Encrypted;
  }

  public getDecryptedProperty(data: string): string {
    const encrypted = this.decrypt(data);

    return Crypto.Decrypt({
      ...encrypted,
      tag: Buffer.from(encrypted.tag),
    });
  }

  abstract create(data: Model): Promise<Model>;
  abstract findAll(): Promise<Model[]>;
  abstract findOne(id: string): Promise<Model | never>;
  abstract update(id: string, newData: Model): Promise<Model | never>;
  abstract remove(id: string): Promise<boolean>;
}
