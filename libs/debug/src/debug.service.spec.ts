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

  it('should returns logger property', () => {
    expect(service.logger()).toBeTruthy();
  });

  it('should be print message type debug', () => {
    expect(service.debug({}, message)).toBe(undefined);
  });

  it('should be print message type error', () => {
    expect(service.error({}, message)).toBe(undefined);
  });

  it('should be print message type fatal', () => {
    expect(service.fatal({}, message)).toBe(undefined);
  });

  it('should be print message type info', () => {
    expect(service.info({}, message)).toBe(undefined);
  });

  it('should be print message type trace', () => {
    expect(service.trace({}, message)).toBe(undefined);
  });

  it('should be print message type warn', () => {
    expect(service.warn({}, message)).toBe(undefined);
  });
});
