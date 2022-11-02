import * as Joi from 'joi';

import { CreatePrivateKeyDto } from '@/privateKeys/dto/create';

export const CreatePrivateKeySchema = Joi.object<CreatePrivateKeyDto>({
  tag: Joi.string().required(),
  secret: Joi.string().required(),
});
