import * as Joi from 'joi';

import { UpdatePrivateKeyDto } from '@/privateKeys/dto/update';

export const UpdatePrivateKeySchema = Joi.object<UpdatePrivateKeyDto>({
  tag: Joi.string().optional(),
  secret: Joi.string().optional(),
});
