import { sign, verify } from 'jsonwebtoken';

export class JsonWebToken<PayloadType> {
  constructor(
    private readonly payload: Record<
      string,
      string | number | boolean | PayloadType
    >,
  ) {}

  public save(secret: string, expiresIn: `${number}${'m' | 'd'}`) {
    try {
      return sign(this.payload, secret || process.env.JWT_SECRET, {
        expiresIn,
      });
    } catch (error) {
      return new Error(error as string);
    }
  }

  public load(token: string, secret: string) {
    try {
      return verify(token, secret || process.env.JWT_SECRET);
    } catch (error) {
      return new Error(error as string);
    }
  }
}
