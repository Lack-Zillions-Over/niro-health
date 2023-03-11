import { Person } from '@app/bjson/mocks/person';

export class Child extends Person {
  constructor(public readonly name: string, public readonly parent: string) {
    super(name);
  }
}
