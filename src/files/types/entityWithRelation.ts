import { File } from '@/files/entities';
import { User } from '@/users/entities';

export type EntityWithRelation = File & {
  author: User;
};
