import type { INestApplication } from '@nestjs/common';
import type { User } from '@app/users/entities';
import type { ISimilarityFilterService, Type } from '@app/similarity-filter';

import { UserDatabaseContract } from '@app/users/contracts';

import * as _ from 'lodash';

export class UserMemoryDB extends UserDatabaseContract {
  private readonly _similarityFilterService: ISimilarityFilterService;

  constructor(
    protected readonly app: INestApplication,
    private users: User[] = [],
  ) {
    super(app);
    this._similarityFilterService = this.app.get<ISimilarityFilterService>(
      'ISimilarityFilterService',
    );
  }

  async create(data: User): Promise<User> {
    this.users.push(data);

    return data;
  }

  async findAll(limit?: number, offset?: number): Promise<User[]> {
    return this.users.slice(offset || 0, limit || this.users.length);
  }

  async findOne(id: number | string): Promise<User | null> {
    return this.users.find((user) => user.id === id);
  }

  async findBy(filter: Partial<User>, similarity?: Type): Promise<User[]> {
    return this.users.filter((key) =>
      this._similarityFilterService.execute<User>(
        filter,
        key as User,
        similarity || 'full',
      ),
    ) as User[];
  }

  async findByEmail(email: string): Promise<User | null> {
    const hash = this.hashText(email);

    return this.users.find((user) => user.hash.email === hash);
  }

  async update(id: number | string, newData: User): Promise<User | null> {
    this.users = this.users.map((user) =>
      user.id === id ? { ...user, ..._.omitBy(newData, _.isNil) } : user,
    ) as User[];

    return await this.findOne(id);
  }

  async delete(id: number | string): Promise<boolean> {
    this.users = this.users.filter((user) => user.id !== id);

    return true;
  }
}
