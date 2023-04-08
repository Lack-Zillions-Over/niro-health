import { Module } from '@nestjs/common';
import { AwsEc2Service } from './aws-ec2.service';
import { AwsCoreModule } from '@app/aws-core';

@Module({
  imports: [AwsCoreModule],
  providers: [AwsEc2Service],
  exports: [AwsEc2Service],
})
export class AwsEc2Module {}
