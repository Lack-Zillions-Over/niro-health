import { S3 } from 'aws-sdk';
import type { AwsSTS } from '@app/aws-sts/aws-sts.interface';

export declare namespace AwsS3 {
  export type File = Express.Multer.File;
  export type GetResponse = S3.GetObjectOutput;

  export interface Class {
    setRole3rdParty(role3rdParty: AwsSTS.Role3rdParty): Promise<void>;
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
}
