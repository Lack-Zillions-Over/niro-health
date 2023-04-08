import { Module } from '@nestjs/common';
import { HypercService } from './hyperc.service';
import { RedisModule } from '@app/redis';

@Module({
  imports: [RedisModule],
  providers: [HypercService],
  exports: [HypercService],
})
export class HypercModule {}
