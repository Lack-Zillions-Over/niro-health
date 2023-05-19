import { Global, Module } from '@nestjs/common';
import { AppHostService } from './app-host.service';

@Global()
@Module({
  providers: [
    {
      provide: 'IAppHostService',
      useClass: AppHostService,
    },
  ],
  exports: [
    {
      provide: 'IAppHostService',
      useClass: AppHostService,
    },
  ],
})
export class AppHostModule {}
