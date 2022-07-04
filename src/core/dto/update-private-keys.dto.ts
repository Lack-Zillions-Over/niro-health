import { PartialType } from '@nestjs/mapped-types';
import { CreatePrivateKeyDto } from './create-private-keys.dto';

export class UpdatePrivateKeyDto extends PartialType(CreatePrivateKeyDto) {}
