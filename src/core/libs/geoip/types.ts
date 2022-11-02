export declare namespace GeoIP {
  export interface Class {
    getIP(): string;
    timezone(): string;
    country(): string;
    city(): string;
    region(): string;
  }
}
