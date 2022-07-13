import { PartialType } from '@nestjs/mapped-types';
import { CreatePrivateKeyDto } from '@/core/dto/create-private-keys.dto';

export class UpdatePrivateKeyDto extends PartialType(CreatePrivateKeyDto) {}
