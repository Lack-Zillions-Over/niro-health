import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@app/users/dto/create';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
