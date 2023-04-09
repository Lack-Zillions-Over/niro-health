export declare namespace ValidatorRegexp {
  export interface Class {
    custom(text: string, regexp: RegExp, expression?: string): void;
    date(text: string): {
      iso: () => void;
    };
    string(text: string): {
      common: () => void;
      alphanumeric: () => void;
      email: () => void;
      uuid: () => void;
      hash: () => void;
      password: () => void;
      secret: () => void;
      smtp: () => void;
    };
    boolean(text: string): void;
    number(text: string): void;
    aws(text: string): {
      api_version: () => void;
      region: () => void;
    };
    node_env(text: string): void;
    version(text: string): void;
    uri(text: string): void;
    url(text: string): void;
    postgresURL(text: string): void;
    redisURL(text: string): void;
    cronTimezone(text: string): void;
  }
}
