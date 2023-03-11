import { Module } from '@nestjs/common';
import { DebugService } from './debug.service';

@Module({
  providers: [DebugService],
  exports: [DebugService],
})
export class DebugModule {}
