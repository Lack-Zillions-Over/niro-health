import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationService } from './configuration.service';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

describe('ConfigurationService', () => {
  let service: ConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigurationService,
        {
          provide: 'IValidatorRegexpService',
          useClass: ValidatorRegexpService,
        },
        { provide: 'IStringExService', useClass: StringExService },
      ],
    }).compile();

    service = module.get<ConfigurationService>(ConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Tests - Environment Variables', () => {
    it('should be defined new variable', () => {
      expect(service.register('Testing', 100)).toBeUndefined();
    });

    it('should be get new variable', () => {
      expect(service.get('Testing')).toBe(100);
    });

    it('should be unregister new variable', () => {
      expect(service.register('Testing2', 'Hello World')).toBeUndefined();
      expect(service.unregister('Testing2')).toBeUndefined();
      expect(service.get('Testing2')).not.toBe('Hello World');
    });
  });

  describe('Tests - App Variables', () => {
    it('should be defined new variable', () => {
      expect(service.setVariable('Testing', 'Hello World')).toBeUndefined();
    });

    it('should be get new variable', () => {
      expect(service.getVariable('Testing')).toBe('Hello World');
    });

    it('should be unregister new variable', () => {
      expect(service.register('Testing2', 100)).toBeUndefined();
      expect(service.unregister('Testing2')).toBeUndefined();
      expect(service.get('Testing2')).not.toBe(100);
    });
  });

  it('should be defined NODE_ENV', () => {
    expect(service.NODE_ENV).toBe('test');
    expect(typeof service.NODE_ENV).toBe('string');
  });

  it('should be defined VERSION', () => {
    expect(service.VERSION).toBe('1.7.0');
    expect(typeof service.VERSION).toBe('string');
  });

  it('should be defined API_URI', () => {
    expect(service.API_URI).toBe('http://localhost:4000');
    expect(typeof service.API_URI).toBe('string');
  });

  it('should be defined WEBAPP_URI', () => {
    expect(service.WEBAPP_URI).toBe('http://localhost:3000');
    expect(typeof service.WEBAPP_URI).toBe('string');
  });

  it('should be defined PORT', () => {
    expect(service.PORT).toBe(4000);
    expect(typeof service.PORT).toBe('number');
  });

  it('should be defined DATABASE_URL', () => {
    expect(service.DATABASE_URL).toBe(
      'postgresql://postgres:postgres@postgres/project_development',
    );
    expect(typeof service.DATABASE_URL).toBe('string');
  });

  it('should be defined DB_PORT', () => {
    expect(service.DB_PORT).toBe(5432);
    expect(typeof service.DB_PORT).toBe('number');
  });

  it('should be defined DB_USERNAME', () => {
    expect(service.DB_USERNAME).toBe('postgres');
    expect(typeof service.DB_USERNAME).toBe('string');
  });

  it('should be defined DB_PASSWORD', () => {
    expect(service.DB_PASSWORD).toBe('postgres');
    expect(typeof service.DB_PASSWORD).toBe('string');
  });

  it('should be defined DB_DATABASE_NAME', () => {
    expect(service.DB_DATABASE_NAME).toBe('project_development');
    expect(typeof service.DB_DATABASE_NAME).toBe('string');
  });

  it('should be defined MONGODB_USERNAME', () => {
    expect(service.MONGODB_USERNAME).toBe('mongodb');
    expect(typeof service.MONGODB_USERNAME).toBe('string');
  });

  it('should be defined MONGODB_PASSWORD', () => {
    expect(service.MONGODB_PASSWORD).toBe('mongodb');
    expect(typeof service.MONGODB_PASSWORD).toBe('string');
  });

  it('should be defined MONGODB_HOST', () => {
    expect(service.MONGODB_HOST).toBe('mongodb');
    expect(typeof service.MONGODB_HOST).toBe('string');
  });

  it('should be defined MONGODB_PORT', () => {
    expect(service.MONGODB_PORT).toBe('27017');
    expect(typeof service.MONGODB_PORT).toBe('string');
  });

  it('should be defined MONGODB_NAME', () => {
    expect(service.MONGODB_NAME).toBe('project_development');
    expect(typeof service.MONGODB_NAME).toBe('string');
  });

  it('should be defined MONGODB_GRIDFS_NAME', () => {
    expect(service.MONGODB_GRIDFS_NAME).toBe('project_development_gridfs');
    expect(typeof service.MONGODB_GRIDFS_NAME).toBe('string');
  });

  it('should be defined MONGODB_CONNECTION_SSL', () => {
    expect(service.MONGODB_CONNECTION_SSL).toBe(false);
    expect(typeof service.MONGODB_CONNECTION_SSL).toBe('boolean');
  });

  it('should be defined MONGODB_PROJECT_NAME', () => {
    expect(service.MONGODB_PROJECT_NAME).toBe('niro_health');
    expect(typeof service.MONGODB_PROJECT_NAME).toBe('string');
  });

  it('should be defined REDIS_HOST', () => {
    expect(service.REDIS_HOST).toBe('redis://redis:6379');
    expect(typeof service.REDIS_HOST).toBe('string');
  });

  it('should be defined REDIS_PORT', () => {
    expect(service.REDIS_PORT).toBe(6379);
    expect(typeof service.REDIS_PORT).toBe('number');
  });

  it('should be defined BULL_BOARD_USERNAME', () => {
    expect(service.BULL_BOARD_USERNAME).toBe('admin');
    expect(typeof service.BULL_BOARD_USERNAME).toBe('string');
  });

  it('should be defined BULL_BOARD_PASSWORD', () => {
    expect(service.BULL_BOARD_PASSWORD).toBe('admin');
    expect(typeof service.BULL_BOARD_PASSWORD).toBe('string');
  });

  it('should be defined CRON_TIMEZONE', () => {
    expect(service.CRON_TIMEZONE).toBe('America/Sao_Paulo');
    expect(typeof service.CRON_TIMEZONE).toBe('string');
  });

  it('should be defined CRYPTO_PASSWORD', () => {
    expect(service.CRYPTO_PASSWORD).toBe(
      'o4t7bNT5CbOnlqBcah40R99zierzSQz3MS9Ssceqq2U=',
    );
    expect(typeof service.CRYPTO_PASSWORD).toBe('string');
  });

  it('should be defined MASTER_KEY', () => {
    expect(service.MASTER_KEY).toBe(
      'eJwFwcFOwzAMANBviZxTJB+c2Il7q7ZdKGWlbGzqKaKbWihTGYzR3+e9knQFqTI7dB5Hz1FCIacPZ8LdF9S4Ldrwa8wymrt7YcJ60xxlQU25g7+068McmjU6GKw3xMr5RI/gIzz3sorqiA3rTRvGs9JUu9bo6NCifRImwQLVwnhRzSml48OeQecSbPiZM+8OSHotaeFNjgXE6/snyVCj+Sa8nvELJnFyFoC07Muh7LQs4jZRf1vnSLZqJxdu/tLmrj+JrUzwYjmxKV4Rwecgb0gY0z8TjUCv',
    );
    expect(typeof service.MASTER_KEY).toBe('string');
  });

  it('should be defined JWT_SECRET', () => {
    expect(service.JWT_SECRET).toBe(
      'cLoM/xpKjQpuL825AZexwyitebaOg94Gr4SzBiBNN6M=',
    );
    expect(typeof service.JWT_SECRET).toBe('string');
  });

  it('should be defined COOKIE_SECRET', () => {
    expect(service.COOKIE_SECRET).toBe(
      'aMIKHAO4USHeyz5b1SqHwKbQcG5ln/D6XkXNqvS8/e0=',
    );
    expect(typeof service.COOKIE_SECRET).toBe('string');
  });

  it('should be defined SESSION_SECRET', () => {
    expect(service.SESSION_SECRET).toBe(
      'Hn+s7UQPty8vkUqvuzzmqysSO0LV/P8r8oUMXEbRLKY=',
    );
    expect(typeof service.SESSION_SECRET).toBe('string');
  });

  it('should be defined AXIOS_URI', () => {
    expect(service.AXIOS_URI).toBe('http://localhost:4000');
    expect(typeof service.AXIOS_URI).toBe('string');
  });

  it('should be defined AXIOS_AUTHORIZATION', () => {
    expect(service.AXIOS_AUTHORIZATION).toBe(
      '3b93157d4096c56fd6e96570b6016b87f6443202',
    );
    expect(typeof service.AXIOS_AUTHORIZATION).toBe('string');
  });

  it('should be defined AWS_ACCESS_KEY_ID', () => {
    expect(service.AWS_ACCESS_KEY_ID).toBe('AKIA56N57H7KHQVADY55');
    expect(typeof service.AWS_ACCESS_KEY_ID).toBe('string');
  });

  it('should be defined AWS_SECRET_ACCESS_KEY', () => {
    expect(service.AWS_SECRET_ACCESS_KEY).toBe(
      'zbVU1PUZFeNbrW0sAP2uG3qRUjT8yD5hqnmhrCr1',
    );
    expect(typeof service.AWS_SECRET_ACCESS_KEY).toBe('string');
  });

  it('should be defined SMTP_HOST', () => {
    expect(service.SMTP_HOST).toBe('smtp.google.com');
    expect(typeof service.SMTP_HOST).toBe('string');
  });

  it('should be defined SMTP_PORT', () => {
    expect(service.SMTP_PORT).toBe(587);
    expect(typeof service.SMTP_PORT).toBe('number');
  });

  it('should be defined SMTP_SECURE', () => {
    expect(service.SMTP_SECURE).toBe(false);
    expect(typeof service.SMTP_SECURE).toBe('boolean');
  });

  it('should be defined SMTP_USERNAME', () => {
    expect(service.SMTP_USERNAME).toBe('jest@gmail.com');
    expect(typeof service.SMTP_USERNAME).toBe('string');
  });

  it('should be defined SMTP_PASSWORD', () => {
    expect(service.SMTP_PASSWORD).toBe('S3nh@Fort3!');
    expect(typeof service.SMTP_PASSWORD).toBe('string');
  });
});
