import { UserDatabaseContract } from '@/users/contracts';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';
import { User } from '@/users/entities';

import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';

import * as _ from 'lodash';

export class UserMemoryDB extends UserDatabaseContract {
  constructor(
    protected readonly libsService: LibsService,
    protected readonly utilsService: UtilsService,
    protected users: User[],
  ) {
    super(libsService, utilsService);
  }

  async create(data: User): Promise<User> {
    this.users.push(data);

    return data;
  }

  async findAll(limit?: number, offset?: number): Promise<User[]> {
    return this.users.slice(offset || 0, limit || this.users.length);
  }

  async findOne(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id);
  }

  async findBy(
    filter: Partial<User>,
    similarity?: SimilarityFilterTypes.SimilarityType,
  ): Promise<User[]> {
    return this.users.filter((key) =>
      this.utilsService
        .similarityFilter()
        .execute<User>(filter, key as User, similarity || 'full'),
    ) as User[];
  }

  async findByEmail(email: string): Promise<User | null> {
    const hash = this.hashByText(email);

    return this.users.find((user) => user.hash.email === hash);
  }

  async update(id: string, newData: User): Promise<User | null> {
    this.users = this.users.map((user) =>
      user.id === id ? { ...user, ..._.omitBy(newData, _.isNil) } : user,
    );

    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    this.users = this.users.filter((user) => user.id !== id);

    return true;
  }
}
