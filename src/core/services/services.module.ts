import { Module } from '@nestjs/common';

import { EC2AWService } from '@/core/services/aws/ec2.service';
import { S3AWService } from '@/core/services/aws/s3.service';

@Module({
  providers: [EC2AWService, S3AWService],
  exports: [EC2AWService, S3AWService],
})
export class ServicesModule {}
