import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthorizationMiddleware } from '../core/middlewares/authorization.middleware';
import { AuthorizationByPrivateKeysMiddleware } from '../core/middlewares/authorization-by-private-keys.middleware';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizationMiddleware, AuthorizationByPrivateKeysMiddleware)
      .forRoutes('users');
  }
}
