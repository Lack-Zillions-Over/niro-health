export declare namespace Crypto {
  export interface Config {
    algorithm: 'aes-128-gcm' | 'aes-192-gcm' | 'aes-256-gcm';
    password: string;
    authTagLength: number;
  }

  export interface Encrypted {
    content: string;
    iv: string;
    tag: Buffer;
  }

  export interface Class {
    encrypt(txt: string, password?: string): Encrypted;
    decrypt(encrypted: Encrypted, password?: string): string;
  }
}
