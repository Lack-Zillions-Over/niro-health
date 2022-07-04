import { UserDatabaseContract } from '../contracts/users-database.contract';
import { User } from '../entities/users.entity';

import { Random } from '../../core/utils/random.util';
import { JWTRevalidate } from '../types/session.type';

export class UserRepository {
  constructor(protected database: UserDatabaseContract) {}

  private async _beforeSave(user: User): Promise<User> {
    user.email = this.database.encrypt(user.email);
    user.password = await this.database.hashByPassword(user.password);

    return user;
  }

  private async _beforeUpdate(beforeData: User, nextData: User): Promise<User> {
    if (
      beforeData.email !== nextData.email &&
      !this.database.compareHashText(nextData.email, beforeData.hash.email)
    )
      nextData.email = this.database.encrypt(beforeData.email);

    if (
      beforeData.password !== nextData.password &&
      !(await this.database.compareHashPassword(
        nextData.password,
        beforeData.password,
      ))
    )
      nextData.password = await this.database.hashByPassword(
        beforeData.password,
      );

    return nextData;
  }

  async register(user: User): Promise<Error | User> {
    if (await this.database.findByUsername(user.username))
      return new Error(
        `User with username "${user.username}" is already exists!`,
      );

    if (await this.database.findByEmail(user.email))
      return new Error(`User with email "${user.email}" is already exists!`);

    return await this.database.create(await this._beforeSave(user));
  }

  async findMany(): Promise<User[]> {
    return await this.database.findAll();
  }

  async findById(id: string): Promise<Error | User> {
    const user = await this.database.findOne(id);

    if (!user) return new Error(`User with id "${id}" not found!`);

    return user;
  }

  async findByUsername(username: string): Promise<Error | User> {
    const user = await this.database.findByUsername(username);

    if (!user) return new Error(`User with username "${username}" not found!`);

    return user;
  }

  async auth(username: string, password: string): Promise<boolean> {
    const user = await this.database.findByUsername(username);

    if (
      !user ||
      !(await this.database.compareHashPassword(password, user.password))
    )
      return false;

    return true;
  }

  async generateAndAssignTokenRevalidate(
    id: string,
  ): Promise<Error | JWTRevalidate> {
    const user = await this.database.findOne(id);

    if (!user) return new Error(`User with id "${id}" not found!`);

    const tokenRevalidate = {
      id: user.id,
      username: user.username,
      value: Random.HASH(128, 'hex'),
      signature: Random.STRING(64),
    };

    await this.update(id, {
      ...user,
      session: {
        tokenRevalidate,
      },
    });

    return tokenRevalidate;
  }

  async validateTokenRevalidate(token: JWTRevalidate): Promise<boolean> {
    const user = await this.database.findOne(token.id);

    if (!user || (user && !user.session)) return false;

    const { value, signature } = user.session.tokenRevalidate;

    return token.value === value && token.signature === signature;
  }

  async update(id: string, newData: User): Promise<Error | User> {
    const user = await this.database.findOne(newData.id);

    if (
      ((user) => (user ? user.id !== newData.id : false))(
        await this.database.findByUsername(newData.username),
      )
    )
      return new Error(`Username "${newData.username} already in use!"`);

    if (
      ((user) => (user ? user.id !== newData.id : false))(
        await this.database.findByEmail(
          this.database.hashByText(newData.email),
        ),
      )
    )
      return new Error(`Email "${newData.email} already in use!"`);

    return await this.database.update(
      id,
      await this._beforeUpdate(user, newData),
    );
  }

  async remove(id: string): Promise<Error | boolean> {
    await this.findById(id);

    return await this.database.remove(id);
  }
}
