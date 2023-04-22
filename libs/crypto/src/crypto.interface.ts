import type { CipherGCMTypes } from 'crypto';

export type Drive = 'fs' | 'redis' | 'sqlite';

export type FileSystemData = {
  key: string;
  value: string | Buffer;
};

export type Config = {
  algorithm: CipherGCMTypes;
  password: string;
  authTagLength: number;
};

export interface ICryptoService {
  encrypt(txt: string, password?: string): Promise<string>;
  decrypt(encrypted: string, password?: string, del?: boolean): Promise<string>;
}
