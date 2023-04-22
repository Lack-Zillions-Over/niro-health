import { CoreEntityContract } from '@app/core/contracts/coreEntity';
import type { Session } from '@app/users/types';

export class User extends CoreEntityContract {
  username: string;
  email: string;
  password: string;
  roles: string[];
  hash: {
    email: string;
  };
  activate: boolean;
  session?: Session;

  constructor(data: Partial<User>) {
    super(data);
    this.username = data?.username;
    this.email = data?.email;
    this.password = data?.password;
    this.roles = data?.roles;
    this.hash = data?.hash;
    this.activate = data?.activate;
    this.session = data?.session;
  }
}
