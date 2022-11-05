import * as Joi from 'joi';

import { LogoutUserDto } from '@/users/dto/logout';

export const LogoutUserSchema = Joi.object<LogoutUserDto>({
  id: Joi.string().required(),
  token_value: Joi.string().required(),
});
