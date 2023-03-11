import { Test, TestingModule } from '@nestjs/testing';
import { BjsonService } from '@app/bjson/bjson.service';
import { Person, Child, Other } from '@app/bjson/mocks';

describe('BjsonService', () => {
  let service: BjsonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BjsonService],
    }).compile();

    service = module.get<BjsonService>(BjsonService);
    service.addConstructors(Person, Child);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be add new constructor to list', () => {
    expect(service.addConstructors(Other)).toBe(undefined);
  });

  it('should be remove constructor from list', () => {
    expect(service.removeConstructors(Other)).toBe(undefined);
  });

  it('should be set max depth', () => {
    expect(service.setMaxDepth(200)).toBe(undefined);
  });

  it('should be get max depth', () => {
    expect(service.getMaxDepth()).toBe(200);
  });

  it('should be make deep copy from Person', () => {
    const person = new Person('Neo');
    const clone = service.makeDeepCopy(person);
    const txt = 'Did you choose the red pill or the blue pill?';
    expect(clone.name).toBe('Neo');
    expect(clone.say(txt)).toBe(txt);
  });

  it('should be stringify JSON', () => {
    expect(
      service.stringify({ a: 100, b: true, c: 'Hello World' }) instanceof
        Uint8Array,
    ).toBe(true);
  });

  describe('Tests with inheritance', () => {
    it('should be stringify Class Person', () => {
      const person = new Person('GuilhermeSantos001');
      const stringify = service.stringify(person);
      const parse = service.parse<Person>(stringify);
      expect(parse.say('Hello World')).toBe('Hello World');
    });

    it('should be stringify Class Child', () => {
      const child = new Child('Niro', 'GuilhermeSantos001');
      const stringify = service.stringify(child);
      const parse = service.parse<Child>(stringify);
      expect(parse.name).toBe('Niro');
      expect(parse.parent).toBe('GuilhermeSantos001');
      expect(parse.say('Niro Health is cool!!!')).toBe(
        'Niro Health is cool!!!',
      );
    });
  });
});
