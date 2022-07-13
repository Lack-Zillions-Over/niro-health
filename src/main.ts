import { NestFactory } from '@nestjs/core';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import fastifyCookie from '@fastify/cookie';

import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });

  await app.listen(4000, '0.0.0.0');
}
bootstrap();
