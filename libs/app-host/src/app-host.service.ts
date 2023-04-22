import { INestApplication, Injectable } from '@nestjs/common';

/**
 * @description The module that provides the access to the NestJS application instance.
 */
@Injectable()
export class AppHostService {
  /**
   * @description The NestJS application instance.
   */
  static app: INestApplication;

  /**
   * @description Set the NestJS application instance.
   * @param app The NestJS application instance.
   * @returns void
   */
  setApp(app: INestApplication) {
    AppHostService.app = app;
  }

  /**
   * @description Returns the underlying native HTTP server.
   * @returns {*}
   */
  getHttpServer() {
    return AppHostService.app.getHttpServer();
  }

  /**
   * @description Returns the underlying HTTP adapter.
   * @returns {HttpServer}
   */
  getHttpAdapter() {
    return AppHostService.app.getHttpAdapter();
  }

  /**
   * @description Returns array of the microservices connected to the NestApplication.
   * @returns {INestMicroservice[]}
   */
  getMicroservices() {
    return AppHostService.app.getMicroservices();
  }

  /**
   * @description Returns the url the application is listening at, based on OS and IP version. Returns as an IP value either in IPv6 or IPv4
   * @returns {Promise<string>} The IP where the server is listening
   */
  getUrl() {
    return AppHostService.app.getUrl();
  }
}
