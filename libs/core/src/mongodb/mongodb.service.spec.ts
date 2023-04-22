import { Test, TestingModule } from '@nestjs/testing';

import { MongoDBService } from './mongodb.service';
import { DebugService } from '@app/debug';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

jest.mock('mongoose', () => jest.requireActual('@test/mocks/mongoose'));
jest.mock('mongodb', () => jest.requireActual('@test/mocks/mongodb'));

describe('MongoDBService', () => {
  let service: MongoDBService;
  let configurationService: ConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoDBService,
        ConfigurationService,
        { provide: 'IDebugService', useClass: DebugService },
        { provide: 'IConfigurationService', useClass: ConfigurationService },
        {
          provide: 'IValidatorRegexpService',
          useClass: ValidatorRegexpService,
        },
        { provide: 'IStringExService', useClass: StringExService },
      ],
    }).compile();

    service = module.get<MongoDBService>(MongoDBService);
    configurationService =
      module.get<ConfigurationService>(ConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be get db', () => {
    expect(service.getDB(configurationService.MONGODB_NAME)).toBeDefined();
  });
});
