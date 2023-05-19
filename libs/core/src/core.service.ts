import { Injectable } from '@nestjs/common';

import { Request } from 'express';
import { getClientIp } from 'request-ip';
import { lookup } from 'geoip-lite';

/**
 * @description The module that provides methods for get client GeoIP and cookie.
 */
@Injectable()
export class CoreService {
  /**
   * @description Get client GeoIP.
   * @param req Request object.
   */
  public async getClientGeoIP<T, P = Request | T>(req: P) {
    const ipAddress = getClientIp(req as Request);

    return {
      ...lookup(ipAddress),
      device_name: (req as Request).headers['user-agent'],
      ipAddress,
    };
  }

  /**
   * @description Get cookie by name.
   * @param req Request object.
   * @param name Cookie name.
   */
  public async getCookie<T, P = Request | T>(req: P, name: string) {
    return (req as Request).cookies[name] as string;
  }
}
