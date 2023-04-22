import * as Joi from 'joi';

import { User } from '@app/users/entities';
import { UpdateUserDto } from '@app/users/dto/update';

declare type DTO = UpdateUserDto & Pick<User, 'roles'>;

export const UpdateUserSchema = Joi.object<DTO>({
  username: Joi.string().optional(),
  password: Joi.string().optional(),
  roles: Joi.array().optional().items(Joi.string()),
});
