import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { CoreService } from './core.service';

jest.mock('request-ip', () => jest.requireActual('@test/mocks/request-ip'));
jest.mock('geoip-lite', () => jest.requireActual('@test/mocks/geoip-lite'));

describe('CoreService', () => {
  let service: CoreService;
  const request = new Request('http://localhost:3000') as unknown as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreService],
    }).compile();

    service = module.get<CoreService>(CoreService);
    request.cookies = { testing: 'Hello World' };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be get info to getClientGeoIP', async () => {
    await expect(service.getClientGeoIP(request)).resolves.toStrictEqual({
      range: [0, 0],
      country: 'US',
      region: 'CA',
      eu: '0',
      timezone: 'America/Los_Angeles',
      city: 'San Francisco',
      ll: [37.7697, -122.3933],
      metro: 807,
      area: 0,
      ipAddress: '127.0.0.1',
      device_name: undefined,
    });
  });

  it('should be get info to getCookie', async () => {
    await expect(service.getCookie(request, 'testing')).resolves.toBe(
      'Hello World',
    );
  });
});
