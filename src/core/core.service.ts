import { Injectable } from '@nestjs/common';

import { Request } from 'express';
import { getClientIp } from 'request-ip';
import { lookup } from 'geoip-lite';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

@Injectable()
export class CoreService {
  constructor(
    public readonly libsService: LibsService,
    public readonly utilsService: UtilsService,
  ) {}

  async getClientGeoIP(req: Request) {
    const ipAddress = getClientIp(req);

    return {
      ...lookup(ipAddress),
      device_name: req.headers['user-agent'],
      ipAddress,
    };
  }

  async getCookie(req: Request, name: string) {
    return req.cookies[name] as string;
  }
}
