import * as Joi from 'joi';

import { ActivateUserDto } from '@/users/dto/activate';

export const ActivateUserSchema = Joi.object<ActivateUserDto>({
  token: Joi.string().required(),
});
