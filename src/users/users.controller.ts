import {
  HttpException,
  HttpStatus,
  Controller,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { Request } from 'express';

import { UsersService } from '@/users/users.service';
import { CoreService } from '@/core/core.service';

import { CreateUserDto } from '@/users/dto/create-users.dto';
import { LoginUserDto } from '@/users/dto/login-users.dto';
import { SessionValidateUserDto } from '@/users/dto/session-validate-users.dto';
import { LogoutUserDto } from '@/users/dto/logout-users.dto';
import { UpdateUserDto } from '@/users/dto/update-users.dto';

import { UsersParser } from '@/users/parsers/users.parser';
import { SessionParser } from '@/users/parsers/session.parser';

@Controller('users')
export class UsersController {
  constructor(
    private readonly coreService: CoreService,
    private readonly usersService: UsersService,
    private readonly usersParser: UsersParser,
    private readonly sessionParser: SessionParser,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    if (user instanceof Error)
      throw new HttpException(user.message, HttpStatus.FORBIDDEN);

    return this.usersParser.toJSON(user);
  }

  @Post('auth/login')
  async login(@Body() loginUserDto: LoginUserDto, @Req() request: Request) {
    const clientGeoIP = await this.coreService.getClientGeoIP(request);

    const session = await this.usersService.login(
      loginUserDto.username,
      loginUserDto.password,
      clientGeoIP.device_name,
      clientGeoIP,
    );

    if (session instanceof Error)
      throw new HttpException(session.message, HttpStatus.FORBIDDEN);

    return this.sessionParser.toJSON(session);
  }

  @Post('auth/validate')
  async sessionValidate(
    @Body() sessionValidateUserDto: SessionValidateUserDto,
    @Req() request: Request,
  ) {
    const clientGeoIP = await this.coreService.getClientGeoIP(request);

    const session = await this.usersService.sessionValidate(
      sessionValidateUserDto.username,
      await this.coreService.getCookie(request, 'token_value'),
      await this.coreService.getCookie(request, 'token_signature'),
      await this.coreService.getCookie(request, 'token_revalidate_value'),
      await this.coreService.getCookie(request, 'token_revalidate_signature'),
      clientGeoIP.device_name,
      clientGeoIP,
    );

    if (session instanceof Error)
      throw new HttpException(session.message, HttpStatus.FORBIDDEN);

    return true;
  }

  @Post('auth/logout')
  async logout(@Body() logoutUserDto: LogoutUserDto, @Req() request: Request) {
    const clientGeoIP = await this.coreService.getClientGeoIP(request);

    const session = await this.usersService.logout(
      logoutUserDto.username,
      await this.coreService.getCookie(request, 'token_value'),
      clientGeoIP.device_name,
    );

    if (session instanceof Error)
      throw new HttpException(session.message, HttpStatus.FORBIDDEN);

    return this.sessionParser.toJSON(session);
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
