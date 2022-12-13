import {
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

import { queuePool } from '@/core/bull/bull-board-queue';

import { HttpService } from '@nestjs/axios';

import EmailNameJob from '@/users/jobs/constants/email/emailNameJob';
import AccountActivateProcess from '@/users/jobs/constants/email/accountActivateProcess';
import { AccountActivateType } from '@/users/jobs/types/email/accountActivate';
import { AccountActivateOptions } from '@/users/jobs/configs/email/accountActivate';

import { RolesGuard } from '@/users/guards/roles.guard';
// import { Roles } from '@/customers/guards/roles.decorator';

import { TokenGuard } from '@/users/guards/token.guard';
// import { Token } from '@/customers/guards/token.decorator';

import { JoiValidationPipe } from '@/core/pipes/joi-validation.pipe';

import { CoreService } from '@/core/core.service';
import { UsersService } from '@/users/users.service';

import { CreateUserDto } from '@/users/dto/create';
import { CreateUserSchema } from '@/users/dto/schemas/create.joi';
import { ActivateUserDto } from '@/users/dto/activate';
import { ActivateUserSchema } from '@/users/dto/schemas/activate.joi';
import { LoginUserDto } from '@/users/dto/login';
import { LoginUserSchema } from '@/users/dto/schemas/login.joi';
import { SessionValidateUserDto } from '@/users/dto/sessionValidate';
import { SessionValidateUserSchema } from '@/users/dto/schemas/sessionValidate.joi';
import { LogoutUserDto } from '@/users/dto/logout';
import { LogoutUserSchema } from '@/users/dto/schemas/logout.joi';
import { UpdateUserDto } from '@/users/dto/update';
import { UpdateUserSchema } from '@/users/dto/schemas/update.joi';

import { UsersParser } from '@/users/parsers';

@Controller('api/users')
@UseGuards(RolesGuard, TokenGuard)
export class UsersController {
  constructor(
    @InjectQueue(EmailNameJob)
    private readonly emailQueue: Queue<AccountActivateType>,
    private readonly coreService: CoreService,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly usersParser: UsersParser,
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
      // const jwt = this.coreService.libsService.jwt({
      //   id: user.id,
      //   username: user.username,
      //   timestamp: new Date().getTime(),
      // });

      // await this.emailQueue.add(
      //   AccountActivateProcess,
      //   {
      //     email: createUserDto.email,
      //     username: createUserDto.username,
      //     token: jwt.save(null, `7d`) as string,
      //     temporarypass: null,
      //   },
      //   AccountActivateOptions,
      // );

      return this.usersParser.toJSON(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }

  @Post('activate')
  @UsePipes(new JoiValidationPipe(ActivateUserSchema))
  async activate(@Body() activateUserDto: ActivateUserDto) {
    const jwt = this.coreService.libsService.jwt<{ id: string }>({});
    const token = jwt.load(activateUserDto.token, null);

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
  async findAll(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    return (
      await this.usersService.findAll(
        limit && parseInt(limit),
        offset && parseInt(offset),
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
  async remove(@Param('id') id: string) {
    const deleted = await this.usersService.remove(id);

    if (deleted instanceof Error)
      throw new HttpException(deleted.message, HttpStatus.FORBIDDEN);

    return deleted;
  }
}
