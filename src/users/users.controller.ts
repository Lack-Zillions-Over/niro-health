import {
  HttpException,
  HttpStatus,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersParser } from './users.parser';

import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersParser: UsersParser,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    if (user instanceof Error)
      throw new HttpException(user.message, HttpStatus.FORBIDDEN);

    return this.usersParser.toJSON(user);
  }

  @Get()
  async findAll() {
    return (await this.usersService.findAll()).map((user) =>
      this.usersParser.toJSON(user),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    if (user instanceof Error)
      throw new HttpException(user.message, HttpStatus.FORBIDDEN);

    return this.usersParser.toJSON(user);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);

    if (user instanceof Error)
      throw new HttpException(user.message, HttpStatus.FORBIDDEN);

    return this.usersParser.toJSON(user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.usersService.remove(id);

    if (deleted instanceof Error)
      throw new HttpException(deleted.message, HttpStatus.FORBIDDEN);

    return deleted;
  }
}
