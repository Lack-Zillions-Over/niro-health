import { createCipheriv, createDecipheriv } from 'crypto';

import { Random } from '@/core/utils/random';
import { Crypto as Types } from '@/core/libs/crypto/types';

export class Crypto implements Types.Class {
  private readonly random: Random;

  constructor() {
    this.random = new Random();
  }

  /**
   * @description Encrypts a string
   */
  public encrypt(txt: string, password?: string): Types.Encrypted {
    const config: Types.Config = {
        algorithm: 'aes-256-gcm',
        password: process.env.CRYPTO_PASSWORD || '',
        authTagLength: 16,
      },
      iv = this.random.string(64),
      cipher = createCipheriv(
        config.algorithm,
        password || config.password,
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
          password || config.password,
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
