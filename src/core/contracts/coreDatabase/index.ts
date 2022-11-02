import { CoreDatabase } from '@/core/contracts/coreDatabase/types';
import { Crypto as CryptoTypes } from '@/core/libs/crypto/types';
import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';

import { RecursivePartial } from '@/core/common/types/recursive-partial.type';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export abstract class CoreDatabaseContract<Model>
  implements CoreDatabase.Class
{
  constructor(
    protected readonly libsService: LibsService,
    protected readonly utilsService: UtilsService,
  ) {}

  public generateID(): string {
    return this.utilsService.random().uuid();
  }

  public hashByText(text: string): string {
    return this.utilsService.stringEx().hash(text, 'sha256', 'base64');
  }

  public compareHashText(text: string, hashed: string): boolean {
    return this.hashByText(text) === hashed;
  }

  public async hashByPassword(password: string): Promise<string> {
    return await this.utilsService.stringEx().hashByPassword(password);
  }

  public async compareHashPassword(
    password: string,
    hashed: string,
  ): Promise<boolean> {
    return await this.utilsService
      .stringEx()
      .compareHashPassword(password, hashed);
  }

  public encrypt(data: string): string {
    return this.utilsService
      .stringEx()
      .compress(JSON.stringify(this.libsService.crypto().encrypt(data)));
  }

  public decrypt(data: string): string {
    const encrypted = this.getDecryptedProperty(data);

    return this.libsService.crypto().decrypt({
      ...encrypted,
      tag: Buffer.from(encrypted.tag),
    });
  }

  public getDecryptedProperty(data: string): CryptoTypes.Encrypted {
    return this.utilsService
      .stringEx()
      .decompress<CryptoTypes.Encrypted>(data) as CryptoTypes.Encrypted;
  }

  abstract create(data: Model): Promise<Model>;
  abstract findAll(): Promise<Model[]>;
  abstract findOne(id: string): Promise<Model | null>;
  abstract findBy(
    filter: RecursivePartial<Model>,
    similarity?: SimilarityFilterTypes.SimilarityType,
  ): Promise<Model[]>;
  abstract update(id: string, newData: Model): Promise<Model | null>;
  abstract remove(id: string): Promise<boolean>;
}
