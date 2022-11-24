export declare namespace LocalPath {
  export interface Class {
    local(p: string): string;
    localExists(p: string): boolean;
    localCreate(p: string): void;
  }
}
