import { User } from '@/users/entities';
import { File } from '@/files/entities';

export type EntityWithRelation = User & {
  files: File[];
};
