import { User } from '@app/users/entities';
import { File } from '@app/files/entities';

export type EntityWithRelation = User & {
  files: File[];
};
