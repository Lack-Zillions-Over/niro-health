export declare namespace i18n {
  export interface Class {
    getLocale(): string;
    getLocales(): string[];
    getPath(): string;
    setLocale(locale: string): void;
    removeLocale(locale: string): void;
    setPath(path: string): void;
    translate(phrase: string, ...params: string[]): string | Error;
  }
}
