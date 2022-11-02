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
    bucket: string,
  ): Promise<string> {
    const { originalname, buffer } = file;
    const { Key, Bucket } = await this.client
      .upload({
        Bucket: bucket,
        Key: `${Date.now()}-${originalname}`,
        Body: buffer,
      })
      .promise();

    return `https://${Bucket}.s3.amazonaws.com/${Key}`;
  }

  public async delete(key: string, bucket: string): Promise<boolean | Error> {
    const { $response } = await this.client
      .deleteObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();

    if ($response.error) return new Error($response.error.message);

    return true;
  }
}
