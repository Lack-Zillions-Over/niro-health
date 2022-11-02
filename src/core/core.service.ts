import { Injectable } from '@nestjs/common';

import { Request } from 'express';
import { getClientIp } from 'request-ip';
import { lookup } from 'geoip-lite';

@Injectable()
export class CoreService {
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
