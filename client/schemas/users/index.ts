import type { Session } from '@/schemas/users/types/session';

import FileSchema from '@/schemas/files';

declare interface UserSchema {
  id: string;
  username: string;
  roles: string[];
  session: Session;
  activate: boolean;
  files: FileSchema[];
  createdAt: string;
  updatedAt: string;
}

export default UserSchema;
