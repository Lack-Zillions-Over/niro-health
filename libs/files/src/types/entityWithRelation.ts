import { File } from '@app/files/entities';
import { User } from '@app/users/entities';

export type EntityWithRelation = File & {
  author: User;
};
