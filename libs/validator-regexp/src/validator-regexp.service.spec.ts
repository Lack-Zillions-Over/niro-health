import { Test, TestingModule } from '@nestjs/testing';
import { ValidatorRegexpService } from './validator-regexp.service';

describe('ValidatorRegexpService', () => {
  let service: ValidatorRegexpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidatorRegexpService],
    }).compile();

    service = module.get<ValidatorRegexpService>(ValidatorRegexpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate custom format', () => {
    const text = '2006-03-01';
    const regexp = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;
    const expression = '2006-03-01';
    const exec = () => service.custom('2011-10', regexp, expression);
    expect(service.custom(text, regexp, expression)).toBeUndefined();
    expect(exec).toThrow();
  });

  it('should validate date format ISO', () => {
    expect(service.date('2011-10-05T14:48:00.000Z').iso).not.toThrow();
    expect(service.date('2011-10-05').iso).toThrow();
  });

  it('should validate string format common', () => {
    expect(service.string('John Doe').common).not.toThrow();
    expect(service.string('John234').common).toThrow();
  });

  it('should validate string format alphanumeric', () => {
    expect(service.string('AKIA56N57H7KHQVADY55').alphanumeric).not.toThrow();
    expect(service.string('AKFJJ@!').alphanumeric).toThrow();
  });

  it('should validate string format email', () => {
    expect(service.string('jane@nirohealth.com').email).not.toThrow();
    expect(service.string('jane@.com').email).toThrow();
  });

  it('should validate string format uuid', () => {
    expect(
      service.string('01cc800f-61ad-4dcc-a08f-7e74679b6c0e').uuid,
    ).not.toThrow();
    expect(service.string('01cc800f-61ad-4dcc').uuid).toThrow();
  });

  it('should validate string format hash', () => {
    expect(
      service.string('3b93157d4096c56fd6e96570b6016b87f6443202').hash,
    ).not.toThrow();
    expect(service.string('3b93157d4096c56fd6e').hash).toThrow();
  });

  it('should validate string format password', () => {
    expect(service.string('S3nh@Fort3!').password).not.toThrow();
    expect(service.string('S3nh@').password).toThrow();
  });

  it('should validate string format secret', () => {
    expect(
      service.string('aMIKHAO4USHeyz5b1SqHwKbQcG5ln/D6XkXNqvS8/e0=').secret,
    ).not.toThrow();
    expect(service.string('@!').secret).toThrow();
  });

  it('should validate string format smtp', () => {
    expect(service.string('smtp.gmail.com').smtp).not.toThrow();
    expect(service.string('smtp.').smtp).toThrow();
  });

  it('should validate boolean', () => {
    const exec = () => service.boolean('test');
    expect(service.boolean('true')).toBeUndefined();
    expect(exec).toThrow();
  });

  it('should validate number', () => {
    const exec = () => service.number('test32');
    expect(service.number('44587')).toBeUndefined();
    expect(exec).toThrow();
  });

  it('should validate aws format api_version', () => {
    expect(service.aws('2006-03-01').api_version).not.toThrow();
    expect(service.aws('2006-03').api_version).toThrow();
  });

  it('should validate aws format region', () => {
    expect(service.aws('us-east-1').region).not.toThrow();
    expect(service.aws('us-east').region).toThrow();
  });

  it('should validate node_env', () => {
    const exec = () => service.node_env('homolog');
    expect(service.node_env('development')).toBeUndefined();
    expect(exec).toThrow();
  });

  it('should validate version', () => {
    const exec = () => service.version('1.0');
    expect(service.version('1.0.0')).toBeUndefined();
    expect(exec).toThrow();
  });

  it('should validate uri', () => {
    const exec = () => service.uri('localhost:3000');
    expect(service.uri('http://localhost:3000')).toBeUndefined();
    expect(exec).toThrow();
  });

  it('should validate url', () => {
    const exec = () => service.url('www.nirohealth.com');
    expect(service.url('https://www.nirohealth.com')).toBeUndefined();
    expect(exec).toThrow();
  });

  it('should validate postgresURL', () => {
    const exec = () =>
      service.postgresURL('postgresql://user:password@localhost');
    expect(
      service.postgresURL('postgresql://user:password@localhost:5432/database'),
    ).toBeUndefined();
    expect(exec).toThrow();
  });

  it('should validate redisURL', () => {
    const exec = () => service.redisURL('redis://redis');
    expect(service.redisURL('redis://redis:6379')).toBeUndefined();
    expect(exec).toThrow();
  });

  it('should validate cronTimezone', () => {
    const exec = () => service.cronTimezone('America/');
    expect(service.cronTimezone('America/Sao_Paulo')).toBeUndefined();
    expect(exec).toThrow();
  });
});
