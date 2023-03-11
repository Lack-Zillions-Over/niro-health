export declare namespace i18n {
  export type Drivers = 'fs' | 'redis';

  export interface Config {
    locale: {
      main: string;
      path: string;
      languages: string[];
      driver: Drivers;
    };
  }

  export interface Class {
    setPath(path: string): void;
    setDriver(driver: Drivers): void;
    addLocale(locale: string): Promise<void>;
    getPath(): string;
    getDriver(): string;
    getLocale(): string;
    getLocales(): string[];
    resetLocales(): Promise<void>;
    removeLocale(locale: string): Promise<number | void>;
    defineProperty<T>(locale: string, prop: T): Promise<false | void | 'OK'>;
    removeProperty(
      locale: string,
      ...props: string[]
    ): Promise<false | void | 'OK'>;
    translate(phrase: string, ...params: string[]): Promise<string>;
  }
}
