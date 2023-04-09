import { CoreDatabase } from '@app/core/contracts/coreDatabase/types';
import { SimilarityFilter } from '@app/similarity-filter/similarity-filter.interface';
import { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import { RandomStringService } from '@app/random';
import { StringExService } from '@app/string-ex';
import { CryptoService } from '@app/crypto';

export abstract class CoreDatabaseContract<Model>
  implements CoreDatabase.Class
{
  constructor(
    protected readonly randomStringService: RandomStringService,
    protected readonly stringExService: StringExService,
    protected readonly cryptoService: CryptoService,
  ) {}

  public generateUUID(): string {
    return this.randomStringService.uuid();
  }

  public hashText(text: string): string {
    return this.stringExService.hash(text, 'sha256', 'base64');
  }

  public compareHashText(text: string, hashed: string): boolean {
    return this.hashText(text) === hashed;
  }

  public async hashPassword(password: string): Promise<string> {
    return await this.stringExService.hashPassword(password);
  }

  public async compareHashPassword(
    password: string,
    hashed: string,
  ): Promise<boolean> {
    return await this.stringExService.compareHashPassword(password, hashed);
  }

  public async encrypt(data: string): Promise<string> {
    return Promise.resolve(
      this.stringExService.compress(
        JSON.stringify(await this.cryptoService.encrypt(data)),
      ),
    );
  }

  public async decrypt(encrypted: string): Promise<string> {
    return await this.cryptoService.decrypt(encrypted);
  }

  abstract create(data: Model): Promise<Model>;
  abstract findAll(limit?: number, skip?: number): Promise<Model[]>;
  abstract findOne(id: number | string): Promise<Model | null>;
  abstract findBy(
    filter: RecursivePartial<Model>,
    similarity?: SimilarityFilter.Type,
  ): Promise<Model[]>;
  abstract update(
    id: number | string,
    newData: RecursivePartial<Model>,
  ): Promise<Model | null>;
  abstract delete(id: number | string): Promise<boolean>;
}
