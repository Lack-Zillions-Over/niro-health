import { CipherGCMTypes } from 'crypto';

export declare namespace Crypto {
  export type Config = {
    algorithm: CipherGCMTypes;
    password: string;
    authTagLength: number;
  };

  export interface Class {
    encrypt(txt: string, password: string): Promise<string>;
    decrypt(
      encrypted: string,
      password: string,
      del?: boolean,
    ): Promise<string>;
  }
}
