import { lookup, Lookup } from 'geoip-lite';

import { GeoIP as Types } from './types';

export class GeoIP implements Types.Class {
  constructor(private readonly ip: string) {}

  private _info(): Lookup {
    return lookup(this.ip);
  }

  public getIP(): string {
    return this.ip;
  }

  public timezone(): string {
    return this._info().timezone;
  }

  public country(): string {
    return this._info().country;
  }

  public city(): string {
    return this._info().city;
  }

  public region(): string {
    return this._info().region;
  }
}
