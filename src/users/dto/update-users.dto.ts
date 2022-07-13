import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@/users/dto/create-users.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
