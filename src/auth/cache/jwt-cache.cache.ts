import { JwtCacheDatabaseContract } from '../contracts/jwt-cache-database.contract';

export class JwtCache {
  constructor(private readonly database: JwtCacheDatabaseContract) {}

  async register(hashed: string, jwt: string) {
    if (await this.database.findOne(hashed))
      return Error(`Token already exists!`);

    return await this.database.save(hashed, jwt);
  }

  async update(hashed: string, newJwt: string) {
    if (!(await this.database.findOne(hashed)))
      return Error(`Token not found!`);

    return await this.database.update(hashed, newJwt);
  }
}
