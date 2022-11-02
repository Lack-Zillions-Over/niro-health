export declare namespace JsonWebToken {
  export type PayloadType<T> = Record<string, T | string | number | boolean>;
  export type ExpiresIn = `${number}${'m' | 'd'}`;

  export interface Class {
    save(secret: string, expiresIn: ExpiresIn): string | Error;
    load<T>(token: string, secret: string): T | string | Error;
  }
}
