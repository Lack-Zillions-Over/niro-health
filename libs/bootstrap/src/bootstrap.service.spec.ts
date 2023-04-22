import { Test, TestingModule } from '@nestjs/testing';
import { BootstrapService } from './bootstrap.service';
import { AppHostService } from '@app/app-host';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { DebugService } from '@app/debug';
import { i18nService } from '@app/i18n';
import { RedisService } from '@app/core/redis/redis.service';
import { PropStringService } from '@app/prop-string';
import { PrismaService } from '@app/core/prisma/prisma.service';
import { MongoDBService } from '@app/core/mongodb/mongodb.service';

jest.mock('ioredis', () => jest.requireActual('@test/mocks/ioredis'));
jest.mock('mongoose', () => jest.requireActual('@test/mocks/mongoose'));
jest.mock('mongodb', () => jest.requireActual('@test/mocks/mongodb'));

describe('BootstrapService', () => {
  let service: BootstrapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BootstrapService,
        AppHostService,
        { provide: 'IConfigurationService', useClass: ConfigurationService },
        {
          provide: 'IValidatorRegexpService',
          useClass: ValidatorRegexpService,
        },
        { provide: 'IStringExService', useClass: StringExService },
        { provide: 'IDebugService', useClass: DebugService },
        { provide: 'Ii18nService', useClass: i18nService },
        { provide: 'IRedisService', useClass: RedisService },
        { provide: 'IPropStringService', useClass: PropStringService },
        { provide: 'IPrismaService', useClass: PrismaService },
        { provide: 'IMongoDBService', useClass: MongoDBService },
      ],
    }).compile();

    service = module.get<BootstrapService>(BootstrapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be main defined', () => {
    expect(service.main).not.toBeNull();
    expect(service.main).not.toBeUndefined();
  });
});
