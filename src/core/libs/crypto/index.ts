import { createHash, createCipheriv, createDecipheriv } from 'crypto';

import { Random } from '@/core/utils/random';
import { Crypto as Types } from '@/core/libs/crypto/types';

export class Crypto implements Types.Class {
  private readonly random: Random;

  constructor() {
    this.random = new Random();
  }

  private _createHash(data: string) {
    return createHash('sha256').update(data).digest('base64').slice(0, 32);
  }

  /**
   * @description Encrypts a string
   */
  public encrypt(txt: string, password?: string): Types.Encrypted {
    console.log(process.env.CRYPTO_PASSWORD);
    const config: Types.Config = {
        algorithm: 'aes-256-gcm',
        password: process.env.CRYPTO_PASSWORD || '',
        authTagLength: 16,
      },
      iv = this._createHash(this.random.hash(24, 'hex')),
      cipher = createCipheriv(
        config.algorithm,
        this._createHash(password || config.password),
        iv,
        { authTagLength: config.authTagLength },
      );

    let encrypted = cipher.update(txt, 'utf8', 'hex');

    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return {
      content: encrypted,
      iv,
      tag,
    };
  }

  /**
   * @description Decrypts a string
   */
  public decrypt(encrypted: Types.Encrypted, password?: string): string {
    try {
      const config: Types.Config = {
          algorithm: 'aes-256-gcm',
          password: process.env.CRYPTO_PASSWORD || '',
          authTagLength: 16,
        },
        iv = encrypted.iv,
        decipher = createDecipheriv(
          config.algorithm,
          this._createHash(password || config.password),
          iv,
          { authTagLength: config.authTagLength },
        );

      decipher.setAuthTag(encrypted.tag);

      let txt = decipher.update(encrypted.content, 'hex', 'utf8');

      txt += decipher.final('utf8');

      return txt;
    } catch (error) {
      return `Error ${error}`;
    }
  }
}
