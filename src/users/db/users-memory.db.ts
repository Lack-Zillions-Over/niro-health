import { UserDatabaseContract } from '@/users/contracts/users-database.contract';
import { User } from '@/users/entities/users.entity';

export class UserMemoryDB extends UserDatabaseContract {
  constructor(protected users: User[]) {
    super();
  }

  async create(data: User): Promise<User> {
    this.users.push(data);

    return data;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findOne(id: string): Promise<User> {
    return this.users.find((user) => user.id === id);
  }

  async findByUsername(username: string): Promise<User> {
    return this.users.find((user) => user.username === username);
  }

  async findByEmail(email: string): Promise<User> {
    const hashed = this.hashByText(email);

    return this.users.find((user) => user.hash.email === hashed);
  }

  async update(id: string, newData: User): Promise<User> {
    this.users = this.users.map((user) =>
      user.id === id ? { ...user, ...newData } : user,
    );

    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    this.users = this.users.filter((user) => user.id !== id);

    return true;
  }
}
