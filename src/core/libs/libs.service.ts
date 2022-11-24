import { Injectable } from '@nestjs/common';

import { Crypto } from '@/core/libs/crypto';
import { GeoIP } from '@/core/libs/geoip';
import { Locale } from '@/core/libs/i18n';
import { ProjectConfig } from '@/core/types/project-config.type';
import { JsonEx } from '@/core/libs/jsonEx';
import { JsonWebToken } from '@/core/libs/jwt';
import { JsonWebToken as JsonWebTokenTypes } from '@/core/libs/jwt/types';
import { Moment } from '@/core/libs/moment';
import { Pino } from '@/core/libs/pino';
import { PrettyOptions } from 'pino-pretty';
import { Nodemailer } from '@/core/libs/nodemailer';
import { Pako } from '@/core/libs/pako';
import { PropString } from '@/core/libs/propString';
import { Redis } from '@/core/libs/redis';
import { FileGridFS } from '@/core/libs/fileGridFS';
import { Archive } from '@/core/libs/archive';
import { MongoDBService } from '@/core/mongodb/mongodb.service';

@Injectable()
export class LibsService {
  constructor(private readonly mongoDBService: MongoDBService) {}

  public crypto() {
    return new Crypto();
  }

  public geoIP(ip: string) {
    return new GeoIP(ip);
  }

  public i18n(options?: ProjectConfig) {
    return new Locale(options);
  }

  public jsonEx(maxDepth = 100) {
    return new JsonEx(maxDepth);
  }

  public jwt<T>(payload: JsonWebTokenTypes.PayloadType<T>) {
    return new JsonWebToken<T>(payload);
  }

  public moment() {
    return new Moment();
  }

  public pino(options: PrettyOptions) {
    return new Pino(options);
  }

  public nodemailer() {
    return new Nodemailer();
  }

  public pako() {
    return new Pako();
  }

  public propString() {
    return new PropString();
  }

  public redis() {
    return new Redis();
  }

  public fileGridFS() {
    return new FileGridFS(this.mongoDBService);
  }

  public archive() {
    return new Archive();
  }
}
