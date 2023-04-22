import type { INestApplication } from '@nestjs/common';
import type { ICoreDatabaseContract } from '@app/core/contracts/coreDatabase/interface';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { IRandomService } from '@app/random';
import type { IStringExService } from '@app/string-ex';
import type { ICryptoService } from '@app/crypto';
import type { Type } from '@app/similarity-filter';

export abstract class CoreDatabaseContract<Model>
  implements ICoreDatabaseContract
{
  protected readonly _randomService: IRandomService;
  protected readonly _stringExService: IStringExService;
  protected readonly _cryptoService: ICryptoService;

  constructor(protected readonly app: INestApplication) {
    this._randomService = this.app.get<IRandomService>('IRandomService');
    this._stringExService = this.app.get<IStringExService>('IStringExService');
    this._cryptoService = this.app.get<ICryptoService>('ICryptoService');
  }

  public generateUUID(): string {
    return this._randomService.uuid();
  }

  public hashText(text: string): string {
    return this._stringExService.hash(text, 'sha256', 'base64');
  }

  public compareHashText(text: string, hashed: string): boolean {
    return this.hashText(text) === hashed;
  }

  public async hashPassword(password: string): Promise<string> {
    return await this._stringExService.hashPassword(password);
  }

  public async compareHashPassword(
    password: string,
    hashed: string,
  ): Promise<boolean> {
    return await this._stringExService.compareHashPassword(password, hashed);
  }

  public async encrypt(data: string): Promise<string> {
    return Promise.resolve(
      this._stringExService.compress(
        JSON.stringify(await this._cryptoService.encrypt(data)),
      ),
    );
  }

  public async decrypt(encrypted: string): Promise<string> {
    return await this._cryptoService.decrypt(encrypted);
  }

  abstract create(data: Model): Promise<Model>;
  abstract findAll(limit?: number, skip?: number): Promise<Model[]>;
  abstract findOne(id: number | string): Promise<Model | null>;
  abstract findBy(
    filter: RecursivePartial<Model>,
    similarity?: Type,
  ): Promise<Model[]>;
  abstract update(
    id: number | string,
    newData: RecursivePartial<Model>,
  ): Promise<Model | null>;
  abstract delete(id: number | string): Promise<boolean>;
}
