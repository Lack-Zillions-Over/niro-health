export declare namespace Debug {
  export interface Class {
    log(msg: string, ...optionalParams: [...any, string?]): void;
    warn(msg: string, ...optionalParams: [...any, string?]): void;
    error(msg: string, ...optionalParams: [...any, string?]): void;
    debug(msg: string, ...optionalParams: [...any, string?]): void;
    verbose(msg: string, ...optionalParams: [...any, string?]): void;
  }
}
