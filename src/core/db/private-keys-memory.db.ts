import { PrivateKeyDatabaseContract } from '../contracts/private-keys-database.contract';
import { PrivateKey } from '../entities/private-keys.entity';

export class PrivateKeyMemoryDB extends PrivateKeyDatabaseContract {
  constructor(protected keys: PrivateKey[]) {
    super();
  }

  async create(data: PrivateKey): Promise<PrivateKey> {
    this.keys.push(data);

    return data;
  }

  async findAll(): Promise<PrivateKey[]> {
    return this.keys;
  }

  async findOne(id: string): Promise<PrivateKey> {
    return this.keys.find((key) => key.id === id);
  }

  async findByTag(tag: string): Promise<PrivateKey> {
    return this.keys.find((key) => key.tag === tag);
  }

  async update(id: string, newData: PrivateKey): Promise<PrivateKey> {
    this.keys = this.keys.map((key) =>
      key.id === id ? { ...key, ...newData } : key,
    );

    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    this.keys = this.keys.filter((key) => key.id !== id);

    return true;
  }
}
