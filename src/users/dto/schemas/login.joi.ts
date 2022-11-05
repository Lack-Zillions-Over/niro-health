import * as Joi from 'joi';

import { LoginUserDto } from '@/users/dto/login';

export const LoginUserSchema = Joi.object<LoginUserDto>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
