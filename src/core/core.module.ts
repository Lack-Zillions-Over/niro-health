import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CoreService } from './core.service';
import { CoreController } from './core.controller';
import { PrivateKeysParser } from './parsers/private-keys.parser';
import { AuthorizationMiddleware } from './middlewares/authorization.middleware';

@Module({
  controllers: [CoreController],
  providers: [CoreService, PrivateKeysParser],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes('core');
  }
}
