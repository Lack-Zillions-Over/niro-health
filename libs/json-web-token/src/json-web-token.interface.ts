export type PayloadType<T> = Record<string, T | string | number | boolean>;
export type ExpiresIn = `${number}${'s' | 'm' | 'd' | 'months'}`;

export interface IJsonWebTokenService {
  save<T>(
    payload: PayloadType<T>,
    secret: string,
    expiresIn: ExpiresIn,
  ): string | Error;
  load<T>(token: string, secret: string): PayloadType<T> | string | Error;
}
