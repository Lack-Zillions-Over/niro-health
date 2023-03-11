export declare namespace Debug {
  export interface Class<T> {
    logger(): T;
    info<T>(obj: T, msg: string, ...args: any[]): void;
    warn<T>(obj: T, msg: string, ...args: any[]): void;
    error<T>(obj: T, msg: string, ...args: any[]): void;
    debug<T>(obj: T, msg: string, ...args: any[]): void;
    trace<T>(obj: T, msg: string, ...args: any[]): void;
    fatal<T>(obj: T, msg: string, ...args: any[]): void;
  }
}
