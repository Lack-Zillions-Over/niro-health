import {
  Inject,
  HttpException,
  HttpStatus,
  Controller,
  UseGuards,
  UsePipes,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Query,
  Param,
  Delete,
} from '@nestjs/common';

import { Request } from 'express';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { queuePool } from '@app/core/bull/bull-board-queue';

// import { HttpService } from '@nestjs/axios';

import EmailNameJob from '@app/users/jobs/constants/email/emailNameJob';
import AccountActivateProcess from '@app/users/jobs/constants/email/accountActivateProcess';
import { AccountActivateType } from '@app/users/jobs/types/email/accountActivate';
import { AccountActivateOptions } from '@app/users/jobs/configs/email/accountActivate';

import { RolesGuard } from '@app/users/guards/roles.guard';
// import { Roles } from '@app/users/guards/roles.decorator';

import { TokenGuard } from '@app/users/guards/token.guard';
// import { Token } from '@app/users/guards/token.decorator';

import { JoiValidationPipe } from '@app/core/pipes/joi-validation.pipe';

import { CoreService } from '@app/core/core.service';
import { AppHostService } from '@app/app-host';
import { JsonWebTokenService } from '@app/json-web-token';

import { UsersService } from '@app/users/users.service';
import { UsersParser } from '@app/users/parsers';

import type { CreateUserDto } from '@app/users/dto/create';
import type { ActivateUserDto } from '@app/users/dto/activate';
import type { LoginUserDto } from '@app/users/dto/login';
import type { SessionValidateUserDto } from '@app/users/dto/sessionValidate';
import type { LogoutUserDto } from '@app/users/dto/logout';
import type { UpdateUserDto } from '@app/users/dto/update';

import { CreateUserSchema } from '@app/users/dto/schemas/create.joi';
import { ActivateUserSchema } from '@app/users/dto/schemas/activate.joi';
import { LoginUserSchema } from '@app/users/dto/schemas/login.joi';
import { SessionValidateUserSchema } from '@app/users/dto/schemas/sessionValidate.joi';
import { LogoutUserSchema } from '@app/users/dto/schemas/logout.joi';
import { UpdateUserSchema } from '@app/users/dto/schemas/update.joi';

@Controller('api/users')
@UseGuards(RolesGuard, TokenGuard)
export class UsersController {
  constructor(
    @InjectQueue(EmailNameJob)
    private readonly emailQueue: Queue<AccountActivateType>,
    // private readonly httpService: HttpService,
    private readonly coreService: CoreService,
    private readonly appHostService: AppHostService,
    @Inject('IUsersService') private readonly usersService: UsersService,
    @Inject('IUsersParser') private readonly usersParser: UsersParser,
  ) {
    queuePool.add(emailQueue);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(CreateUserSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    if (user instanceof Error)
      throw new HttpException(user.message, HttpStatus.FORBIDDEN);

    try {
      await this.emailQueue.add(
        AccountActivateProcess,
        {
          email: createUserDto.email,
          username: createUserDto.username,
          token: this.appHostService.app
            .get<JsonWebTokenService>('IJsonWebTokenService')
            .save(
              {
                id: user.id,
                username: user.username,
                timestamp: new Date().getTime(),
              },
              null,
              `7d`,
            ) as string,
          temporarypass: null,
        },
        AccountActivateOptions,
      );

      return this.usersParser.toJSON(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }

  @Post('activate')
  @UsePipes(new JoiValidationPipe(ActivateUserSchema))
  async activate(@Body() activateUserDto: ActivateUserDto) {
    const token = this.appHostService.app
      .get<JsonWebTokenService>('IJsonWebTokenService')
      .load(activateUserDto.token, null);

    if (token instanceof Error)
      throw new HttpException(
        'Account activation token is invalid. Please try again.',
        HttpStatus.FORBIDDEN,
      );

    const { id } = token as { id: string };

    const user = await this.usersService.activate(id);

    if (user instanceof Error)
      throw new HttpException(user.message, HttpStatus.FORBIDDEN);

    return true;
  }

  @Post('auth/login')
  @UsePipes(new JoiValidationPipe(LoginUserSchema))
  async login(@Body() loginUserDto: LoginUserDto, @Req() request: Request) {
    const clientGeoIP = await this.coreService.getClientGeoIP(request);

    const user = await this.usersService.login(
      loginUserDto.email,
      loginUserDto.password,
      clientGeoIP.device_name,
      {
        ...clientGeoIP,
        token_signature: '',
      },
    );

    if (user instanceof Error)
      throw new HttpException(user.message, HttpStatus.FORBIDDEN);

    return this.usersParser.toJSON(user);
  }

  @Post('auth/validate')
  @UsePipes(new JoiValidationPipe(SessionValidateUserSchema))
  async sessionValidate(
    @Body() sessionValidateUserDto: SessionValidateUserDto,
    @Req() request: Request,
  ) {
    const clientGeoIP = await this.coreService.getClientGeoIP(request);

    const session = await this.usersService.sessionValidate(
      sessionValidateUserDto.id,
      sessionValidateUserDto.token_value,
      sessionValidateUserDto.token_signature,
      sessionValidateUserDto.token_revalidate_value,
      sessionValidateUserDto.token_revalidate_signature,
      clientGeoIP.device_name,
      {
        ...clientGeoIP,
        token_signature: sessionValidateUserDto.token_signature,
      },
    );

    if (session instanceof Error)
      throw new HttpException(session.message, HttpStatus.FORBIDDEN);

    return session;
  }

  @Post('auth/logout')
  @UsePipes(new JoiValidationPipe(LogoutUserSchema))
  async logout(@Body() logoutUserDto: LogoutUserDto) {
    const session = await this.usersService.logout(
      logoutUserDto.id,
      logoutUserDto.token_value,
    );

    if (session instanceof Error)
      throw new HttpException(session.message, HttpStatus.FORBIDDEN);

    return true;
  }

  @Get()
  async findAll(@Query('limit') limit: string, @Query('skip') skip: string) {
    return (
      await this.usersService.findAll(
        limit && parseInt(limit),
        skip && parseInt(skip),
      )
    ).map((user) => this.usersParser.toJSON(user));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    if (user instanceof Error)
      throw new HttpException(user.message, HttpStatus.FORBIDDEN);

    return this.usersParser.toJSON(user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(UpdateUserSchema))
    updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);

    if (user instanceof Error)
      throw new HttpException(user.message, HttpStatus.FORBIDDEN);

    return this.usersParser.toJSON(user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleted = await this.usersService.delete(id);

    if (deleted instanceof Error)
      throw new HttpException(deleted.message, HttpStatus.FORBIDDEN);

    return deleted;
  }
}
