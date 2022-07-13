import { Injectable } from '@nestjs/common';

import { User } from '@/users/entities/users.entity';

@Injectable()
export class SessionParser {
  toJSON(user: User): Partial<User> {
    return {
      id: user.id,
      session: user.session,
    };
  }
}
