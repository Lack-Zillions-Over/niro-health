import { PartialType } from '@nestjs/mapped-types';
import { CreatePrivateKeyDto } from '@/privateKeys/dto/create';

export class UpdatePrivateKeyDto extends PartialType(CreatePrivateKeyDto) {}
