import { Session } from '@/users/types/session.type';

export class User {
  id: string;
  username: string;
  email: string;
  password: string;
  hash: {
    email: string;
  };
  session?: Session;
}
