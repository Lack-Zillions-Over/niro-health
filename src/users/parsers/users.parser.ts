import { Injectable } from '@nestjs/common';

import { User } from '@/users/entities/users.entity';

@Injectable()
export class UsersParser {
  toJSON(user: User): Partial<User> {
    return {
      id: user.id,
      username: user.username,
    };
  }
}
