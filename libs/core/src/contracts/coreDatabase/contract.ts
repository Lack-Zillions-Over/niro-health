import type { INestApplication } from '@nestjs/common';
import type { ICoreDatabaseContract } from '@app/core/contracts/coreDatabase/interface';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { IRandomService } from '@app/random';
import type { IStringExService } from '@app/string-ex';
import type { ICryptoService } from '@app/crypto';
import type { Type } from '@app/similarity-filter';

/**
 * @description The contract that provides methods for database.
 */
export abstract class CoreDatabaseContract<Model>
  implements ICoreDatabaseContract
{
  /**
   * @description Instance of Random service.
   */
  protected readonly _randomService: IRandomService;

  /**
   * @description Instance of StringEx service.
   */
  protected readonly _stringExService: IStringExService;

  /**
   * @description Instance of Crypto service.
   */
  protected readonly _cryptoService: ICryptoService;

  constructor(protected readonly app: INestApplication) {
    this._randomService = this.app.get<IRandomService>('IRandomService');
    this._stringExService = this.app.get<IStringExService>('IStringExService');
    this._cryptoService = this.app.get<ICryptoService>('ICryptoService');
  }

  /**
   * @description Generate UUID.
   */
  public generateUUID(): string {
    return this._randomService.uuid();
  }

  /**
   * @description Generate hash by text.
   * @param text Text for hash.
   */
  public hashText(text: string): string {
    return this._stringExService.hash(text, 'sha256', 'base64');
  }

  /**
   * @description Compare hash by text with hashed text.
   * @param text Text for hash.
   * @param hashed Hashed text.
   */
  public compareHashText(text: string, hashed: string): boolean {
    return this.hashText(text) === hashed;
  }

  /**
   * @description Generate hash for password.
   * @param password Password for hash.
   */
  public async hashPassword(password: string): Promise<string> {
    return await this._stringExService.hashPassword(password);
  }

  /**
   * @description Compare hash for password with hashed password.
   * @param password Password for hash.
   * @param hashed Hashed password.
   */
  public async compareHashPassword(
    password: string,
    hashed: string,
  ): Promise<boolean> {
    return await this._stringExService.compareHashPassword(password, hashed);
  }

  /**
   * @description Encrypt data string to base64.
   * @param data Data string.
   */
  public async encrypt(data: string): Promise<string> {
    return Promise.resolve(
      this._stringExService.compress(
        JSON.stringify(await this._cryptoService.encrypt(data)),
      ),
    );
  }

  /**
   * @description Decrypt encrypted base64 to string.
   * @param encrypted Encrypted base64.
   */
  public async decrypt(encrypted: string): Promise<string> {
    return await this._cryptoService.decrypt(encrypted);
  }

  /**
   * @description Create new model.
   */
  abstract create(data: Model): Promise<Model>;

  /**
   * @description Find all models.
   * @param limit Limit of models.
   * @param skip Skip models.
   */
  abstract findAll(limit?: number, skip?: number): Promise<Model[]>;

  /**
   * @description Find one model by id.
   * @param id Id of model.
   */
  abstract findOne(id: number | string): Promise<Model | null>;

  /**
   * @description Find models by filter.
   * @param filter Filter for find.
   * @param similarity Similarity for find.
   */
  abstract findBy(
    filter: RecursivePartial<Model>,
    similarity?: Type,
  ): Promise<Model[]>;

  /**
   * @description Update model by id.
   * @param id Id of model.
   * @param newData New data for update.
   */
  abstract update(
    id: number | string,
    newData: RecursivePartial<Model>,
  ): Promise<Model | null>;

  /**
   * @description Delete model by id.
   * @param id Id of model.
   */
  abstract delete(id: number | string): Promise<boolean>;
}
