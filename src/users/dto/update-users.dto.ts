import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-users.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
