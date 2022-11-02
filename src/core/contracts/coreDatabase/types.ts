import { Crypto as CryptoTypes } from '@/core/libs/crypto/types';

export declare namespace CoreDatabase {
  export interface Class {
    generateID(): string;
    hashByText(text: string): string;
    compareHashText(text: string, hashed: string): boolean;
    hashByPassword(password: string): Promise<string>;
    compareHashPassword(password: string, hashed: string): Promise<boolean>;
    encrypt(data: string): string;
    decrypt(data: string): string;
    getDecryptedProperty(data: string): CryptoTypes.Encrypted;
  }
}
