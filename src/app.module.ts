import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

import { redisOptions } from '@/core/constants';
import { AuthorizationMiddleware } from '@/core/middlewares/authorization.middleware';
import { SchedulesModule } from '@/schedules/schedules.module';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { CoreModule } from '@/core/core.module';
import { PrivateKeysModule } from '@/privateKeys/privateKeys.module';
import { UsersModule } from '@/users/users.module';
import { FilesModule } from '@/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      url: redisOptions.url,
    }),
    CoreModule,
    SchedulesModule,
    PrivateKeysModule,
    UsersModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes('api');
  }
}
