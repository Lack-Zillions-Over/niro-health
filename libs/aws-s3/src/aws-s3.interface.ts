import type { S3 } from 'aws-sdk';
import type { Role3rdParty } from '@app/aws-sts';
import type { IAwsCoreService } from '@app/aws-core';

export type File = Express.Multer.File;
export type GetResponse = S3.GetObjectOutput;

export interface IAwsS3Service extends IAwsCoreService {
  setRole3rdParty(role3rdParty: Role3rdParty): Promise<void>;
  upload(
    file: Express.Multer.File,
    filename: string,
    mimetype: string,
    version: number,
    bucket: string,
    serverSideEncryption: string,
  ): Promise<string | Error>;
  get(
    filename: string,
    mimetype: string,
    version: number,
    bucket: string,
  ): Promise<GetResponse | Error>;
  delete(
    filename: string,
    mimetype: string,
    version: number,
    bucket: string,
  ): Promise<boolean | Error>;
}
