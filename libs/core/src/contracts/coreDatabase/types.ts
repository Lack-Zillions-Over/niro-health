export declare namespace CoreDatabase {
  export interface Class {
    generateUUID(): string;
    hashText(text: string): string;
    compareHashText(text: string, hashed: string): boolean;
    hashPassword(password: string): Promise<string>;
    compareHashPassword(password: string, hashed: string): Promise<boolean>;
    encrypt(data: string): Promise<string>;
    decrypt(data: string): Promise<string>;
  }
}
