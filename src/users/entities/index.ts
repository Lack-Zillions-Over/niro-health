import { Session } from '@/users/types/session';

export class User {
  id: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
  hash: {
    email: string;
  };
  activate: boolean;
  session?: Session;
  createdAt: Date;
  updatedAt: Date;
}
