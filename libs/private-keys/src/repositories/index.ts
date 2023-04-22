import type { INestApplication } from '@nestjs/common';
import { PrivateKeyDatabaseContract } from '@app/private-keys/contracts';
import { RepositoryContract } from '@app/core/contracts/coreRepository';
import { PrivateKey } from '@app/private-keys/entities';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { Type } from '@app/similarity-filter';
import type { Ii18nService } from '@app/i18n';

export class PrivateKeyRepository extends RepositoryContract {
  private readonly _i18nService: Ii18nService;

  constructor(
    protected readonly database: PrivateKeyDatabaseContract,
    protected readonly app: INestApplication,
  ) {
    super(database);
    this._i18nService = this.app.get<Ii18nService>('Ii18nService');
  }

  private async _findByTag(tag: string) {
    return await this.database.findByTag(tag);
  }

  public async beforeSave(model: PrivateKey): Promise<PrivateKey> {
    model.secret = await this.database.hashPassword(model.secret);
    return model;
  }

  public async beforeUpdate(
    beforeData: PrivateKey,
    nextData: PrivateKey,
  ): Promise<PrivateKey> {
    if (beforeData.secret !== nextData.secret)
      nextData.secret = await this.database.hashPassword(nextData.secret);

    return nextData;
  }

  public async encrypt(data: string): Promise<string> {
    return this.database.encrypt(data);
  }

  public async decrypt(data: string): Promise<string> {
    return this.database.decrypt(data);
  }

  public async create(key: PrivateKey): Promise<Error | PrivateKey> {
    if (await this._findByTag(key.tag))
      return new Error(
        (await this._i18nService.translate(
          'private-keys.repository.private_key_already_exists',
          'tag',
          key.tag,
        )) as string,
      );

    return await this.database.create(await this.beforeSave(key));
  }

  public async validate(tag: string, secret: string, value: string) {
    const key = await this._findByTag(tag);

    if (!key)
      return new Error(
        (await this._i18nService.translate(
          'private-keys.repository.private_key_not_found',
          'tag',
          tag,
        )) as string,
      );

    if (!(await this.database.compareHashPassword(secret, key.secret)))
      return new Error(
        (await this._i18nService.translate(
          'private-keys.repository.invalid_secret',
        )) as string,
      );

    return key.value === value;
  }

  public async findAll(limit?: number, offset?: number): Promise<PrivateKey[]> {
    return await this.database.findAll(limit, offset);
  }

  public async findBy(
    filter: RecursivePartial<PrivateKey>,
    similarity?: Type,
  ): Promise<PrivateKey[]> {
    return await this.database.findBy(filter, similarity);
  }

  public async findById(id: string): Promise<Error | PrivateKey> {
    const key = await this.database.findOne(id);

    if (!key)
      return new Error(
        (await this._i18nService.translate(
          'private-keys.repository.private_key_not_found',
          'id',
          id,
        )) as string,
      );

    return key;
  }

  public async findByTag(tag: string): Promise<Error | PrivateKey> {
    const key = await this.database.findByTag(tag);

    if (!key)
      return new Error(
        (await this._i18nService.translate(
          'private-keys.repository.private_key_not_found',
          'tag',
          tag,
        )) as string,
      );

    return key;
  }

  public async update(
    id: string,
    newData: RecursivePartial<PrivateKey>,
  ): Promise<Error | PrivateKey> {
    const key = await this.findById(id);

    if (key instanceof Error) return new Error(key.message);

    if (
      ((key) => (key ? key.id !== newData.id : false))(
        await this._findByTag(newData.tag),
      )
    )
      return new Error(
        (await this._i18nService.translate(
          'private-keys.repository.field_in_use',
          'tag',
          newData.tag,
        )) as string,
      );

    return await this.database.update(
      id,
      await this.beforeUpdate(key, { ...newData } as PrivateKey),
    );
  }

  public async delete(id: string): Promise<Error | boolean> {
    const key = await this.findById(id);

    if (key instanceof Error) return new Error(key.message);

    return await this.database.delete(id);
  }
}
