import { Test, TestingModule } from '@nestjs/testing';
import { SimilarityFilterService } from './similarity-filter.service';

describe('SimilarityFilterService', () => {
  let service: SimilarityFilterService;
  const object = {
    name: 'John Doe',
    age: 24,
    address: {
      street: 'test',
      number: 10,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimilarityFilterService],
    }).compile();

    service = module.get<SimilarityFilterService>(SimilarityFilterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should filtered object with a simple field', () => {
    expect(
      service.execute(
        {
          name: 'John Doe',
        },
        object,
        '50%',
      ),
    ).toBe(true);
  });

  it('should filtered object with the 100% the corrects fields', () => {
    expect(
      service.execute(
        {
          address: {
            street: 'test',
          },
        },
        object,
        'full',
      ),
    ).toBe(true);
  });

  it('should filtered object with the 50% the corrects fields', () => {
    expect(
      service.execute(
        {
          address: {
            street: 'test',
            number: 20,
          },
        },
        object,
        '50%',
      ),
    ).toBe(true);
  });

  it('should filtered object with any correct field', () => {
    expect(
      service.execute(
        {
          address: {
            street: 'test',
            number: 20,
          },
        },
        object,
        'any-one',
      ),
    ).toBe(true);
  });

  it('should not filtered object with the incorrect field', () => {
    expect(
      service.execute(
        {
          address: {
            number: 20,
          },
        },
        object,
        'full',
      ),
    ).toBe(false);
  });
});
