import { Injectable } from '@nestjs/common';
import { awsConfiguration } from '@/core/constants';

import * as S3 from 'aws-sdk/clients/s3';

@Injectable()
export class S3AWService {
  private readonly client: S3;

  constructor() {
    this.client = new S3(awsConfiguration);
  }

  public async upload(
    file: Express.Multer.File,
    filename: string,
    mimetype: string,
    version: number,
    bucket: string,
    serverSideEncryption: string,
  ): Promise<string | Error> {
    try {
      const { buffer } = file;
      const { Key, Bucket } = await this.client
        .upload({
          Bucket: bucket,
          Key: `${filename}_v${version}${mimetype}`,
          ServerSideEncryption: serverSideEncryption,
          Body: buffer,
        })
        .promise();

      return await this.client.getSignedUrlPromise('getObject', {
        Bucket,
        Key,
      });
    } catch (error) {
      return new Error(error.message);
    }
  }

  public async get(
    filename: string,
    mimetype: string,
    version: number,
    bucket: string,
  ): Promise<S3.GetObjectOutput | Error> {
    try {
      const res = await this.client
        .getObject({
          Bucket: bucket,
          Key: `${filename}_v${version}${mimetype}`,
        })
        .promise();

      if (res.$response.error) throw new Error(res.$response.error.message);

      return res;
    } catch (error) {
      return new Error(error.message);
    }
  }

  public async delete(
    filename: string,
    mimetype: string,
    version: number,
    bucket: string,
  ): Promise<boolean | Error> {
    try {
      const res = await this.client
        .deleteObject({
          Bucket: bucket,
          Key: `${filename}_v${version}${mimetype}`,
        })
        .promise();

      if (res.$response.error) throw new Error(res.$response.error.message);

      return true;
    } catch (error) {
      return new Error(error.message);
    }
  }
}
