import { PrivateKeyDatabaseContract } from '@/privateKeys/contracts';
import { RepositoryContract } from '@/core/contracts/coreRepository';
import { PrivateKey } from '@/privateKeys/entities';

import { RecursivePartial } from '@/core/common/types/recursive-partial.type';
import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';

export class PrivateKeyRepository extends RepositoryContract<
  PrivateKey,
  PrivateKeyDatabaseContract
> {
  private async _findByTag(tag: string) {
    return await this.database.findByTag(tag);
  }

  public async beforeSave(model: PrivateKey): Promise<PrivateKey> {
    model.secret = await this.database.hashByPassword(model.secret);

    return model;
  }

  public async beforeUpdate(
    beforeData: PrivateKey,
    nextData: PrivateKey,
  ): Promise<PrivateKey> {
    if (beforeData.secret !== nextData.secret)
      nextData.secret = await this.database.hashByPassword(nextData.secret);

    return nextData;
  }

  public async decryptFieldValue(value: string): Promise<string> {
    return this.database.decrypt(value);
  }

  public async register(key: PrivateKey): Promise<Error | PrivateKey> {
    if (await this._findByTag(key.tag))
      return new Error(
        this.libsService
          .i18n()
          .translate(
            'private-keys.repository.private_key_already_exists',
            'tag',
            key.tag,
          ) as string,
      );

    return await this.database.create(await this.beforeSave(key));
  }

  public async validate(tag: string, secret: string, value: string) {
    const key = await this._findByTag(tag);

    if (!key)
      return new Error(
        this.libsService
          .i18n()
          .translate(
            'private-keys.repository.private_key_not_found',
            'tag',
            tag,
          ) as string,
      );

    if (!(await this.database.compareHashPassword(secret, key.secret)))
      return new Error(
        this.libsService
          .i18n()
          .translate('private-keys.repository.invalid_secret') as string,
      );

    return key.value === value;
  }

  public async findMany(
    limit?: number,
    offset?: number,
  ): Promise<PrivateKey[]> {
    return await this.database.findAll(limit, offset);
  }

  public async findBy(
    filter: RecursivePartial<PrivateKey>,
    similarity?: SimilarityFilterTypes.SimilarityType,
  ): Promise<PrivateKey[]> {
    return await this.database.findBy(filter, similarity);
  }

  public async findById(id: string): Promise<Error | PrivateKey> {
    const key = await this.database.findOne(id);

    if (!key)
      return new Error(
        this.libsService
          .i18n()
          .translate(
            'private-keys.repository.private_key_not_found',
            'id',
            id,
          ) as string,
      );

    return key;
  }

  public async findByTag(tag: string): Promise<Error | PrivateKey> {
    const key = await this.database.findByTag(tag);

    if (!key)
      return new Error(
        this.libsService
          .i18n()
          .translate(
            'private-keys.repository.private_key_not_found',
            'tag',
            tag,
          ) as string,
      );

    return key;
  }

  public async update(
    id: string,
    newData: PrivateKey,
  ): Promise<Error | PrivateKey> {
    const key = await this.findById(id);

    if (key instanceof Error) return new Error(key.message);

    if (
      ((key) => (key ? key.id !== newData.id : false))(
        await this._findByTag(newData.tag),
      )
    )
      return new Error(
        this.libsService
          .i18n()
          .translate(
            'private-keys.repository.field_in_use',
            'Tag',
            newData.tag,
          ) as string,
      );

    return await this.database.update(
      id,
      await this.beforeUpdate(key, newData),
    );
  }

  public async remove(id: string): Promise<Error | boolean> {
    const key = await this.findById(id);

    if (key instanceof Error) return new Error(key.message);

    return await this.database.remove(id);
  }
}
