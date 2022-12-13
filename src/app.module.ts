import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

import { redisOptions } from '@/core/constants';
import { AuthorizationMiddleware } from '@/core/middlewares/authorization.middleware';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { CoreModule } from '@/core/core.module';
import { SchedulesModule } from '@/schedules/schedules.module';
import { WebSocketModule } from '@/websockets/websocket.module';
import { PrivateKeysModule } from '@/privateKeys/privateKeys.module';
import { UsersModule } from '@/users/users.module';
import { FilesModule } from '@/files/files.module';

import { MongooseAppModule } from '@/mongoose/mongoose.module';
import MongoDbURL from '@/core/common/functions/MongoDbURL';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      MongoDbURL({
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
        host: process.env.MONGODB_HOST,
        port: process.env.MONGODB_PORT,
        database: process.env.MONGODB_NAME,
        appname: process.env.MONGODB_PROJECT_NAME,
        ssl: process.env.MONGODB_CONNECTION_SSL === 'true',
      }),
    ),
    BullModule.forRoot({
      url: redisOptions.url,
    }),
    CoreModule,
    SchedulesModule,
    MongooseAppModule,
    WebSocketModule,
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
