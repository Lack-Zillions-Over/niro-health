export interface JwtCacheDatabaseContract {
  save(key: string, jwt: string): Promise<boolean>;
  update(key: string, newJwt: string): Promise<boolean>;
  findAll(): Promise<string[]>;
  findOne(key: string): Promise<string | never>;
  delete(key: string): Promise<boolean>;
}
