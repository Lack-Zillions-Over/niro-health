export declare namespace Redis {
  export interface Class {
    keys(pattern: string): Promise<string[]>;
    save(key: string, value: string): Promise<boolean>;
    saveBuffer(key: string, value: Buffer): Promise<boolean>;
    update(key: string, newValue: string): Promise<boolean>;
    updateBuffer(key: string, newValue: Buffer): Promise<boolean>;
    findAll(): Promise<Array<string | Buffer>>;
    findOne(key: string): Promise<string | Buffer | null>;
    delete(...keys: string[]): Promise<boolean>;
    flushall(): Promise<'OK'>;
  }
}
