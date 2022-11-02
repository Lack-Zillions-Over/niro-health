import { NestFactory } from '@nestjs/core';
import * as passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { getBullBoardQueues } from '@/core/bull/bull-board-queue';

import { AppModule } from '@/app.module';

import * as cookieParser from 'cookie-parser';

import { PrismaService } from '@/core/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(cookieParser());

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const bullBoardUserName = process.env.BULL_BOARD_USERNAME;
  const bullBoardPassword = process.env.BULL_BOARD_PASSWORD;

  passport.use(
    new BasicStrategy((username, password, done) => {
      if (username === bullBoardUserName && password === bullBoardPassword) {
        done(null, true);
      } else {
        done(null, false);
      }
    }),
  );

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  const queues = getBullBoardQueues();

  createBullBoard({
    queues,
    serverAdapter,
  });

  app.use(
    '/admin/queues',
    passport.authenticate('basic', {
      session: false,
    }),
    serverAdapter.getRouter(),
  );

  await app.listen(4000, '0.0.0.0');
}
bootstrap();
