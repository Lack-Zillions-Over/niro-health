import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { Logger } from '@nestjs/common';
import { AppHostModule, AppHostService } from '@app/app-host';
import { BootstrapModule, BootstrapService } from '@app/bootstrap';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger('NestApplication', {
      timestamp: true,
    }),
    cors: true,
  });
  app.select(AppHostModule).get(AppHostService).setApp(app);
  app.select(BootstrapModule).get(BootstrapService).main();
})();
