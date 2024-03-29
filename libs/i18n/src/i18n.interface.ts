export type Drivers = 'fs' | 'redis';

export interface Config {
  locale: {
    main: string;
    path: string;
    languages: string[];
    driver: Drivers;
  };
}

export interface Ii18nService {
  setPath(path: string): void;
  setDriver(driver: Drivers): void;
  addLocale(locale: string): Promise<void>;
  getPath(): string;
  getDriver(): string;
  getLocale(): string;
  getLocales(): string[];
  resetLocales(): Promise<void>;
  removeLocale(locale: string): Promise<number | void>;
  defineLocale(locale: string): Promise<void>;
  defineProperty<T>(locale: string, prop: T): Promise<false | void | 'OK'>;
  removeProperty(
    locale: string,
    ...props: string[]
  ): Promise<false | void | 'OK'>;
  translate(phrase: string, ...params: string[]): Promise<string>;
}
