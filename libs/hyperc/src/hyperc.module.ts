import { Module } from '@nestjs/common';
import { HypercService } from './hyperc.service';

@Module({
  providers: [HypercService],
  exports: [HypercService],
})
export class HypercModule {}
