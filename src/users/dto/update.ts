import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@/users/dto/create';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
