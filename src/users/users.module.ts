import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersParser } from './users.parser';
import { AuthorizationMiddleware } from '../core/middlewares/authorization.middleware';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersParser],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes('users');
  }
}
