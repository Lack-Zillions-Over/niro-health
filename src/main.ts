import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { Logger } from '@nestjs/common';
import { BootstrapModule, BootstrapService } from '@app/bootstrap';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger('NestApplication', {
      timestamp: true,
    }),
    cors: true,
  });
  await app.init();
  app.select(BootstrapModule).get(BootstrapService).app = app;
  app.select(BootstrapModule).get(BootstrapService).main();
})();
