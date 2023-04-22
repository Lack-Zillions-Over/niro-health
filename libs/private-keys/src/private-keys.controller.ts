import {
  HttpException,
  HttpStatus,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Param,
  Delete,
  UsePipes,
  Inject,
} from '@nestjs/common';

import { JoiValidationPipe } from '@app/core/pipes/joi-validation.pipe';

import { PrivateKeysService } from '@app/private-keys';

import type { CreatePrivateKeyDto } from '@app/private-keys/dto/create';
import type { UpdatePrivateKeyDto } from '@app/private-keys/dto/update';

import { CreatePrivateKeySchema } from '@app/private-keys/dto/schemas/create.joi';
import { UpdatePrivateKeySchema } from '@app/private-keys/dto/schemas/update.joi';

import { PrivateKeysParser } from '@app/private-keys/parsers';

@Controller('api/core')
export class PrivateKeysController {
  constructor(
    @Inject('IPrivateKeysService')
    private readonly privateKeysService: PrivateKeysService,
    @Inject('IPrivateKeysParser')
    private readonly privateKeysParser: PrivateKeysParser,
  ) {}

  @Get('private-keys/master-key')
  async makeMasterKey(@Query('key') key: string) {
    return await this.privateKeysService.makeMasterKey(key);
  }

  @Post('private-keys')
  @UsePipes(new JoiValidationPipe(CreatePrivateKeySchema))
  async create(@Body() createPrivateKeyDto: CreatePrivateKeyDto) {
    const key = await this.privateKeysService.createPrivateKey(
      createPrivateKeyDto,
    );

    if (key instanceof Error)
      throw new HttpException(key.message, HttpStatus.FORBIDDEN);

    return this.privateKeysParser.toJSON(key);
  }

  @Get('private-keys')
  async findAllPrivateKeys(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    return (
      await this.privateKeysService.findAllPrivateKeys(
        limit && parseInt(limit),
        offset && parseInt(offset),
      )
    ).map((key) => this.privateKeysParser.toJSON(key));
  }

  @Get('private-keys/id/:id')
  async findByPrivateKeys(@Param('id') id: string) {
    return (
      await this.privateKeysService.findByPrivateKeys({ id }, 'full')
    ).map((key) => this.privateKeysParser.toJSON(key));
  }

  @Get('private-keys/tag/:tag')
  async findByTagPrivateKey(@Param('tag') tag: string) {
    const key = await this.privateKeysService.findByTagPrivateKey(tag);

    if (key instanceof Error)
      throw new HttpException(key.message, HttpStatus.FORBIDDEN);

    return this.privateKeysParser.toJSON(key);
  }

  @Patch('private-keys/:id')
  async updatePrivateKey(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(UpdatePrivateKeySchema))
    updatePrivateKeyDto: UpdatePrivateKeyDto,
  ) {
    const key = await this.privateKeysService.updatePrivateKey(
      id,
      updatePrivateKeyDto,
    );

    if (key instanceof Error)
      throw new HttpException(key.message, HttpStatus.FORBIDDEN);

    return this.privateKeysParser.toJSON(key);
  }

  @Delete('private-keys/:id')
  async removePrivateKey(@Param('id') id: string) {
    const deleted = await this.privateKeysService.deletePrivateKey(id);

    if (deleted instanceof Error)
      throw new HttpException(deleted.message, HttpStatus.FORBIDDEN);

    return deleted;
  }
}
