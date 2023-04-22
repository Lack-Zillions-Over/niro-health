import { Global, Module } from '@nestjs/common';
import { AppHostService } from './app-host.service';

@Global()
@Module({
  providers: [AppHostService],
  exports: [AppHostService],
})
export class AppHostModule {}
