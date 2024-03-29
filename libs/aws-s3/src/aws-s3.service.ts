import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

import type { IAwsS3Service, GetResponse } from '@app/aws-s3';
import type { IAwsCoreServiceImpl } from '@app/aws-core';
import type { Role3rdParty } from '@app/aws-sts';

/**
 * @description The module that provides the AWS S3 service.
 */
@Injectable()
export class AwsS3Service implements IAwsS3Service {
  constructor(
    @Inject('IAwsCoreService')
    private readonly awsCoreService: IAwsCoreServiceImpl,
  ) {}

  /**
   * @description Get the AWS S3 client.
   */
  public async client() {
    const configuration = await this.awsCoreService.configuration();
    const client = new S3({
      ...configuration,
    });
    return client;
  }

  /**
   * @description Set the role 3rd party.
   */
  public async setRole3rdParty(role3rdParty: Role3rdParty): Promise<void> {
    await this.awsCoreService.setRole3rdParty(role3rdParty);
  }

  /**
   * @description Upload a file to S3.
   */
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

  /**
   * @description Get a file from S3.
   */
  public async get(
    filename: string,
    mimetype: string,
    version: number,
    bucket: string,
  ): Promise<GetResponse | Error> {
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

  /**
   * @description Delete a file from S3.
   */
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
