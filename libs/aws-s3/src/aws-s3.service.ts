import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

import type { AwsCore } from '@app/aws-core/aws-core.interface';
import { AwsCoreService } from '@app/aws-core';
import { AwsS3 } from '@app/aws-s3/aws-s3.interface';

@Injectable()
export class AwsS3Service implements AwsCore.Service, AwsS3.Class {
  constructor(private readonly awsCore: AwsCoreService) {}

  public async client() {
    const configuration = await this.awsCore.configuration();
    const client = new S3({
      ...configuration,
    });
    return client;
  }

  public async setRole3rdParty(
    role3rdParty: AwsCore.Role3rdParty,
  ): Promise<void> {
    await this.awsCore.setRole3rdParty(role3rdParty);
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
      const client = await this.client();

      if (client instanceof Error) return new Error(client.message);

      const { buffer } = file;
      const { Key, Bucket } = await client
        .upload({
          Bucket: bucket,
          Key: `${filename}_v${version}${mimetype}`,
          ServerSideEncryption: serverSideEncryption,
          Body: buffer,
        })
        .promise();

      return await client.getSignedUrlPromise('getObject', {
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
  ): Promise<AwsS3.GetResponse | Error> {
    try {
      const client = await this.client();

      if (client instanceof Error) return new Error(client.message);

      const res = await client
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
      const client = await this.client();

      if (client instanceof Error) return new Error(client.message);

      const res = await client
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
