import { PartialType } from '@nestjs/mapped-types';
import { CreateFileDto } from './create';

export class UpdateFileDto extends PartialType(CreateFileDto) {}
