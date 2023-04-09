import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

// import { AuthorizationMiddleware } from '@/core/middlewares/authorization.middleware';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

// import { CoreModule } from '@/core/core.module';
// import { WebSocketModule } from '@/websockets/websocket.module';
// import { PrivateKeysModule } from '@/privateKeys/privateKeys.module';
// import { UsersModule } from '@/users/users.module';
// import { FilesModule } from '@/files/files.module';

// import { MongooseAppModule } from '@/mongoose/mongoose.module';
// import MongoDbURL from '@/core/common/functions/MongoDbURL';

import { CoreModule } from '@app/core';
import { ConfigurationService } from '@app/configuration';
import { BootstrapModule } from '@app/bootstrap';
import { DebugService } from '@app/debug';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
// import { SchedulesModule } from '@app/schedules';
// import { UsersModule } from '@app/users';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      url: process.env.REDIS_HOST,
      redis: {
        password: process.env.REDIS_PASSWORD,
      },
    }),
    BootstrapModule,
    CoreModule,
    // SchedulesModule,
    // UsersModule,
    // MongooseModule.forRoot(
    //   MongoDbURL({
    //     username: process.env.MONGODB_USERNAME,
    //     password: process.env.MONGODB_PASSWORD,
    //     host: process.env.MONGODB_HOST,
    //     port: process.env.MONGODB_PORT,
    //     database: process.env.MONGODB_NAME,
    //     appname: process.env.MONGODB_PROJECT_NAME,
    //     ssl: process.env.MONGODB_CONNECTION_SSL === 'true',
    //   }),
    // ),
    // MongooseAppModule,
    // WebSocketModule,
    // PrivateKeysModule,
    // UsersModule,
    // FilesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigurationService,
    DebugService,
    ValidatorRegexpService,
    StringExService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(AuthorizationMiddleware).forRoutes('api');
  }
}
