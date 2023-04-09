import { Module } from '@nestjs/common';
import { CoreService } from '@app/core/core.service';

@Module({
  providers: [CoreService],
  exports: [CoreService],
})
export class CoreModule {}
