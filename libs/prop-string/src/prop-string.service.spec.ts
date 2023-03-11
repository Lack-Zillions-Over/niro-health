import { Test, TestingModule } from '@nestjs/testing';
import { PropStringService } from './prop-string.service';

describe('PropStringService', () => {
  let service: PropStringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropStringService],
    }).compile();

    service = module.get<PropStringService>(PropStringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be get value of property in object by string', () => {
    const text = 'Hello World';
    const prop = service.execute('text.hello', {
      text: { hello: text },
    });

    expect(prop).toBe(text);
  });
});
