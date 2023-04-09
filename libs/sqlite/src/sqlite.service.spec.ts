import { Test, TestingModule } from '@nestjs/testing';
import { SqliteService } from './sqlite.service';
import { ConfigurationModule } from '@app/configuration';

describe('SqliteService', () => {
  let service: SqliteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigurationModule],
      providers: [SqliteService],
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
