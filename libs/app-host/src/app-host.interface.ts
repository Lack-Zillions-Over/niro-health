import {
  HttpServer,
  INestApplication,
  INestMicroservice,
} from '@nestjs/common';

export interface IAppHostService {
  app: INestApplication;
  setApp(app: INestApplication): void;
  getHttpServer();
  getHttpAdapter(): HttpServer;
  getMicroservices(): INestMicroservice[];
  getUrl(): Promise<string>;
}
