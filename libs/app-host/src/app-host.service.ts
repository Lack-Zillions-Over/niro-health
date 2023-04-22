import { INestApplication, Injectable } from '@nestjs/common';

@Injectable()
export class AppHostService {
  app: INestApplication;

  setApp(app: INestApplication) {
    this.app = app;
  }

  getHttpServer() {
    return this.app.getHttpServer();
  }

  getHttpAdapter() {
    return this.app.getHttpAdapter();
  }

  getMicroservices() {
    return this.app.getMicroservices();
  }

  getUrl() {
    return this.app.getUrl();
  }
}
