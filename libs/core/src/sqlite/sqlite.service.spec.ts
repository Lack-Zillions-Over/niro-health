import { Test, TestingModule } from '@nestjs/testing';
import { SqliteService } from './sqlite.service';
import { DebugService } from '@app/debug';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

describe('SqliteService', () => {
  let service: SqliteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SqliteService,
        { provide: 'IDebugService', useClass: DebugService },
        { provide: 'IConfigurationService', useClass: ConfigurationService },
        {
          provide: 'IValidatorRegexpService',
          useClass: ValidatorRegexpService,
        },
        { provide: 'IStringExService', useClass: StringExService },
      ],
    }).compile();

    service = module.get<SqliteService>(SqliteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get db', () => {
    expect(service.db).toBeDefined();
  });
});
