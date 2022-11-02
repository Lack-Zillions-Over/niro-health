import { Module } from '@nestjs/common';

import { MarketplaceMeteringAWService } from '@/core/services/aws/marketplace-metering.service';
import { EC2AWService } from '@/core/services/aws/ec2.service';
import { S3AWService } from '@/core/services/aws/s3.service';

@Module({
  providers: [MarketplaceMeteringAWService, EC2AWService, S3AWService],
  exports: [MarketplaceMeteringAWService, EC2AWService, S3AWService],
})
export class ServicesModule {}
