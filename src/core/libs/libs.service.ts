import { Injectable } from '@nestjs/common';

import { Crypto } from '@/core/libs/crypto';
import { GeoIP } from '@/core/libs/geoip';
import { Locale } from '@/core/libs/i18n';
import { ProjectConfig } from '@/core/types/project-config.type';
import { JsonEx } from '@/core/libs/jsonEx';
import { JsonWebToken } from '@/core/libs/jwt';
import { JsonWebToken as JsonWebTokenTypes } from '@/core/libs/jwt/types';
import { Moment } from '@/core/libs/moment';
import { Nodemailer } from '@/core/libs/nodemailer';
import { Pako } from '@/core/libs/pako';
import { PropString } from '@/core/libs/propString';
import { Redis } from '@/core/libs/redis';

@Injectable()
export class LibsService {
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
}
