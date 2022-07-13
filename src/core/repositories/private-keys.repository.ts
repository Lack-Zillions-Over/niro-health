import { PrivateKeyDatabaseContract } from '@/core/contracts/private-keys-database.contract';
import { PrivateKey } from '@/core/entities/private-keys.entity';
import { Locale } from '@/core/libs/i18n.lib';

export class PrivateKeyRepository {
  constructor(
    protected database: PrivateKeyDatabaseContract,
    protected locale: Locale,
  ) {}

  private async _findByTag(tag: string) {
    return await this.database.findByTag(tag);
  }

  private async _beforeSave(key: PrivateKey): Promise<PrivateKey> {
    key.secret = await this.database.hashByPassword(key.secret);

    return key;
  }

  async register(key: PrivateKey): Promise<Error | PrivateKey> {
    if (await this._findByTag(key.tag))
      return new Error(
        this.locale.translate(
          'private-keys.repository.private_key_already_exists',
          'tag',
          key.tag,
        ) as string,
      );

    return await this.database.create(await this._beforeSave(key));
  }

  async validate(tag: string, secret: string, value: string) {
    const key = await this._findByTag(tag);

    if (!key)
      return new Error(
        this.locale.translate(
          'private-keys.repository.private_key_not_found',
          'tag',
          tag,
        ) as string,
      );

    if (!(await this.database.compareHashPassword(secret, key.secret)))
      return new Error(
        this.locale.translate(
          'private-keys.repository.invalid_secret',
        ) as string,
      );

    return key.value === value;
  }

  async findMany(): Promise<PrivateKey[]> {
    return await this.database.findAll();
  }

  async findById(id: string): Promise<Error | PrivateKey> {
    const key = await this.database.findOne(id);

    if (!key)
      return new Error(
        this.locale.translate(
          'private-keys.repository.private_key_not_found',
          'id',
          id,
        ) as string,
      );

    return key;
  }

  async findByTag(tag: string): Promise<Error | PrivateKey> {
    const key = await this.database.findByTag(tag);

    if (!key)
      return new Error(
        this.locale.translate(
          'private-keys.repository.private_key_not_found',
          'tag',
          tag,
        ) as string,
      );

    return key;
  }

  async update(id: string, newData: PrivateKey): Promise<Error | PrivateKey> {
    if (
      ((key) => (key ? key.id !== newData.id : false))(
        await this._findByTag(newData.tag),
      )
    )
      return new Error(
        this.locale.translate(
          'private-keys.repository.field_in_use',
          'Tag',
          newData.tag,
        ) as string,
      );

    return await this.database.update(id, await this._beforeSave(newData));
  }

  async remove(id: string): Promise<Error | boolean> {
    const key = await this.findById(id);

    if (key instanceof Error) return new Error(key.message);

    return await this.database.remove(id);
  }
}
