import { Test, TestingModule } from '@nestjs/testing';
import { DebugService } from './debug.service';

describe('DebugService', () => {
  let service: DebugService;
  const message = 'Niro is cool!!!';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DebugService],
    }).compile();

    service = module.get<DebugService>(DebugService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be print message type log', () => {
    expect(service.log('Hello World')).toBe(undefined);
  });

  it('should be print message type debug', () => {
    expect(service.debug(message)).toBe(undefined);
  });

  it('should be print message type warn', () => {
    expect(service.warn(message)).toBe(undefined);
  });

  it('should be print message type error', () => {
    expect(service.error(message)).toBe(undefined);
  });

  it('should be print message type verbose', () => {
    expect(service.verbose(message)).toBe(undefined);
  });
});
