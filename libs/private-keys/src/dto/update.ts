import { PartialType } from '@nestjs/mapped-types';
import { CreatePrivateKeyDto } from '@app/private-keys/dto/create';

export class UpdatePrivateKeyDto extends PartialType(CreatePrivateKeyDto) {}
