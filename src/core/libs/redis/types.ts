export declare namespace Redis {
  export interface Class {
    save(key: string, value: string): Promise<boolean>;
    update(key: string, newValue: string): Promise<boolean>;
    findAll(): Promise<string[]>;
    findOne(key: string): Promise<string | null>;
    delete(key: string): Promise<boolean>;
  }
}
