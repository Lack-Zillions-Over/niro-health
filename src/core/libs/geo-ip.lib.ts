import { lookup } from 'geoip-lite';

export class GeoIP {
  constructor(private readonly ip: string) {}

  private info() {
    return lookup(this.ip);
  }

  public timezone() {
    return this.info().timezone;
  }

  public country() {
    return this.info().country;
  }

  public city() {
    return this.info().city;
  }

  public region() {
    return this.info().region;
  }
}
