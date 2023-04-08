import { Module } from '@nestjs/common';
import { AwsCoreModule } from '@app/aws-core';
import { AwsS3Service } from './aws-s3.service';

@Module({
  imports: [AwsCoreModule],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
