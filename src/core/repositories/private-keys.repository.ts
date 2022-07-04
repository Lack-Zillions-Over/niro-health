import { PrivateKeyDatabaseContract } from '../contracts/private-keys-database.contract';
import { PrivateKey } from '../entities/private-keys.entity';

export class PrivateKeyRepository {
  constructor(protected database: PrivateKeyDatabaseContract) {}

  private async _findByTag(tag: string) {
    return await this.database.findByTag(tag);
  }

  private async _beforeSave(key: PrivateKey): Promise<PrivateKey> {
    key.secret = await this.database.hashByPassword(key.secret);

    return key;
  }

  async register(key: PrivateKey): Promise<Error | PrivateKey> {
    if (await this._findByTag(key.tag))
      return new Error(`Key with tag "${key.tag}" is already exists!`);

    return await this.database.create(await this._beforeSave(key));
  }

  async validate(tag: string, secret: string, value: string) {
    const key = await this._findByTag(tag);

    if (!key) new Error(`Key with tag "${tag}" not found!`);

    if (this.database.getDecryptedProperty(key.secret) !== secret)
      new Error(`Secret of key is invalid.`);

    return key.value === value;
  }

  async findMany(): Promise<PrivateKey[]> {
    return await this.database.findAll();
  }

  async findById(id: string): Promise<Error | PrivateKey> {
    const key = await this.database.findOne(id);

    if (!key) return new Error(`Key with id "${id}" not found!`);

    return key;
  }

  async findByTag(tag: string): Promise<Error | PrivateKey> {
    const key = await this.database.findByTag(tag);

    if (!key) return new Error(`Key with tag "${tag}" not found!`);

    return key;
  }

  async update(id: string, newData: PrivateKey): Promise<Error | PrivateKey> {
    if (
      ((key) => (key ? key.id !== newData.id : false))(
        await this._findByTag(newData.tag),
      )
    )
      return new Error(`Tag "${newData.tag} already in use!"`);

    return await this.database.update(id, await this._beforeSave(newData));
  }

  async remove(id: string): Promise<Error | boolean> {
    await this.findById(id);

    return await this.database.remove(id);
  }
}
