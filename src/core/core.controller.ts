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

import { CoreService } from './core.service';
import { CreatePrivateKeyDto } from './dto/create-private-keys.dto';
import { UpdatePrivateKeyDto } from './dto/update-private-keys.dto';
import { PrivateKeysParser } from './parsers/private-keys.parser';

@Controller('core')
export class CoreController {
  constructor(
    private readonly coreService: CoreService,
    private readonly privateKeysParser: PrivateKeysParser,
  ) {}

  @Post('private/keys')
  async create(@Body() createPrivateKeyDto: CreatePrivateKeyDto) {
    const key = await this.coreService.createPrivateKey(createPrivateKeyDto);

    if (key instanceof Error)
      throw new HttpException(key.message, HttpStatus.FORBIDDEN);

    return this.privateKeysParser.toJSON(key);
  }

  @Get('private/keys')
  async findAllPrivateKeys() {
    return (await this.coreService.findAllPrivateKeys()).map((key) =>
      this.privateKeysParser.toJSON(key),
    );
  }

  @Get('private/keys/:tag')
  async findByTagPrivateKey(@Param('tag') tag: string) {
    const key = await this.coreService.findByTagPrivateKey(tag);

    if (key instanceof Error)
      throw new HttpException(key.message, HttpStatus.FORBIDDEN);

    return this.privateKeysParser.toJSON(key);
  }

  @Patch('private/keys/:id')
  async updatePrivateKey(
    @Param('id') id: string,
    @Body() updatePrivateKeyDto: UpdatePrivateKeyDto,
  ) {
    const key = await this.coreService.updatePrivateKey(
      id,
      updatePrivateKeyDto,
    );

    if (key instanceof Error)
      throw new HttpException(key.message, HttpStatus.FORBIDDEN);

    return this.privateKeysParser.toJSON(key);
  }

  @Delete('private/keys/:id')
  async removePrivateKey(@Param('id') id: string) {
    const deleted = await this.coreService.removePrivateKey(id);

    if (deleted instanceof Error)
      throw new HttpException(deleted.message, HttpStatus.FORBIDDEN);

    return deleted;
  }
}
