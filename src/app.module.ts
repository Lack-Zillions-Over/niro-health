import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthorizationMiddleware } from '@/core/middlewares/authorization.middleware';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { LocaleModule } from './core/i18n/i18n.module';
import { CoreModule } from '@/core/core.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [LocaleModule, CoreModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes('core', 'users');
  }
}
