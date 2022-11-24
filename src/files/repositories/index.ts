import { FileDatabaseContract } from '@/files/contracts';
import { RepositoryContract } from '@/core/contracts/coreRepository';
import { File } from '@/files/entities';
import { RecursivePartial } from '@/core/common/types/recursive-partial.type';
import { SimilarityFilter } from '@/core/utils/similarityFilter/types';

export class FileRepository extends RepositoryContract<
  File,
  FileDatabaseContract
> {
  private async _getNextVersion(file: File): Promise<File> {
    const version = (
      await this.database.findBy({
        authorId: file.authorId,
        name: file.name,
        mimetype: file.mimetype,
      })
    )
      .map((file) => file.version)
      .sort((a, b) => a - b)
      .pop();

    file.version = version ? version + 1 : 1;

    return file;
  }

  public async _verifyIsTemporary(file: File): Promise<File> {
    if (file.temporary)
      file.expiredAt = this.libsService
        .moment()
        .instance()
        .add(1, 'day')
        .toDate();

    return file;
  }

  public async beforeSave(model: File): Promise<File> {
    model = await this._getNextVersion(model);
    model = await this._verifyIsTemporary(model);

    return model;
  }

  public async beforeUpdate(
    beforeData: File,
    nextData: Partial<File>,
  ): Promise<File> {
    return { ...beforeData, ...nextData };
  }

  public async decryptFieldValue(value: string): Promise<string> {
    return this.database.decrypt(value);
  }

  public async register(model: File): Promise<File | Error> {
    model = await this.beforeSave(model);

    return await this.database.create(model);
  }

  public async findMany(limit?: number, offset?: number): Promise<File[]> {
    return await this.database.findAll(limit, offset);
  }

  public async findBy(
    filter: RecursivePartial<File>,
    similarity?: SimilarityFilter.SimilarityType,
  ): Promise<File[]> {
    return await this.database.findBy(filter, similarity);
  }

  public async findById(id: string): Promise<File | Error> {
    const file = await this.database.findOne(id);

    return file ? file : new Error('File not found');
  }

  public async findByTemporary(): Promise<File[]> {
    return await this.database.findBy({ temporary: true });
  }

  public async update(
    id: string,
    newData: Partial<File>,
  ): Promise<File | Error> {
    const file = await this.findById(id);

    if (file instanceof Error) return file;

    return await this.database.update(
      id,
      await this.beforeUpdate(file, newData),
    );
  }

  public async remove(id: string): Promise<boolean | Error> {
    return (await this.database.remove(id))
      ? true
      : new Error('File not found');
  }
}
