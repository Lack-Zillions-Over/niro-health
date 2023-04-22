import * as Joi from 'joi';

import { CreatePrivateKeyDto } from '@app/private-keys/dto/create';

export const CreatePrivateKeySchema = Joi.object<CreatePrivateKeyDto>({
  tag: Joi.string().required(),
  secret: Joi.string().required(),
});
