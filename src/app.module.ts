import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

import { AuthorizationMiddleware } from '@app/core/middlewares/authorization.middleware';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

// import { CoreModule } from '@/core/core.module';
// import { WebSocketModule } from '@/websockets/websocket.module';

// import { MongooseAppModule } from '@/mongoose/mongoose.module';
// import { MongoDbURL } from '@/core/common/functions/MongoDbURL';

import { AppHostModule } from '@app/app-host';
import { BootstrapModule } from '@app/bootstrap';
import { PrivateKeysModule } from '@app/private-keys';
import { UsersModule } from '@app/users';
import { FilesModule } from '@app/files';
import { SchedulesModule } from '@app/schedules';

import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { i18nService } from '@app/i18n';
import { RedisService } from '@app/core/redis/redis.service';
import { PropStringService } from '@app/prop-string';
import { DebugService } from '@app/debug';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot('users-queues', {
      url: process.env.REDIS_HOST,
      redis: {
        password: process.env.REDIS_PASSWORD,
      },
    }),
    AppHostModule,
    BootstrapModule,
    SchedulesModule,
    PrivateKeysModule,
    UsersModule,
    FilesModule,
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: 'IConfigurationService', useClass: ConfigurationService },
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
    { provide: 'Ii18nService', useClass: i18nService },
    { provide: 'IPropStringService', useClass: PropStringService },
    { provide: 'IRedisService', useClass: RedisService },
    { provide: 'IDebugService', useClass: DebugService },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizationMiddleware)
      .exclude('(.*)/private-keys/master-key')
      .forRoutes('api');
  }
}
