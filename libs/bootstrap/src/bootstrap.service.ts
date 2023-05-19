import { Inject, Injectable } from '@nestjs/common';

import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';

import { BasicStrategy } from 'passport-http';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';

import { getBullBoardQueues } from '@app/core';
import { EN, PT_BR } from '@app/bootstrap/translations';

// import { RedisIoAdapter } from '@app/websockets/adapters/redis-io.adapter';

import type {
  IBootstrapService,
  acceptFunc,
  disposeFunc,
} from '@app/bootstrap';
import { AppHostService } from '@app/app-host';
import type { IConfigurationService } from '@app/configuration';
import type { IDebugService } from '@app/debug';
import type { Ii18nService } from '@app/i18n';
import type { IPrismaService } from '@app/core/prisma/prisma.interface';
import type { IMongoDBService } from '@app/core/mongodb/mongodb.interface';

declare const module: {
  hot: {
    accept: acceptFunc;
    dispose: disposeFunc;
  };
};

@Injectable()
export class BootstrapService implements IBootstrapService {
  constructor(
    private readonly appHostService: AppHostService,
    @Inject('IConfigurationService')
    private readonly configurationService: IConfigurationService,
    @Inject('IDebugService') private readonly debugService: IDebugService,
    @Inject('Ii18nService') private readonly i18nService: Ii18nService,
    @Inject('IPrismaService') private readonly prismaService: IPrismaService,
    @Inject('IMongoDBService') private readonly mongoDBService: IMongoDBService,
  ) {
    this.configurationService.setVariable('bootstrap_listen_port', 4000);
    this.configurationService.setVariable('bootstrap_listen_origin', '0.0.0.0');
    this.configurationService.setVariable(
      'archive_level_compression',
      'best_compression',
    );
    this.configurationService.setVariable('aws_api_version', 'latest');
    this.configurationService.setVariable('aws_region', 'us-east-1');
    this.configurationService.setVariable('sqlite_dbname', 'memoryDB');
    this.configurationService.setVariable('crypto_driver', 'redis');
    this.configurationService.setVariable('files_single_mimetypes', [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/tiff',
      'image/ico',
    ]);
    this.configurationService.setVariable('files_multiple_mimetypes', [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/tiff',
      'image/ico',
    ]);
    this.configurationService.setVariable(
      'files_single_aws_bucket',
      'niro-health-single',
    );
    this.configurationService.setVariable(
      'files_multiple_aws_bucket',
      'niro-health-multiple',
    );
    this.configurationService.setVariable('files_path', '/uploads');
  }

  private get port(): number {
    return this.configurationService.getVariable('bootstrap_listen_port')
      ? parseInt(
          this.configurationService.getVariable('bootstrap_listen_port'),
        ) ?? 4000
      : 4000;
  }

  private get listenOrigin(): string {
    return (
      this.configurationService.getVariable('bootstrap_listen_origin') ??
      '0.0.0.0'
    );
  }

  private async _loadTranslations() {
    await this.i18nService.addLocale('en');
    await this.i18nService.addLocale('pt-br');
    await this.i18nService.defineProperty('en', EN);
    await this.i18nService.defineProperty('pt-br', PT_BR);
    await this.i18nService.defineLocale('en');
  }

  private async _loadDatabases() {
    await this.prismaService.enableShutdownHooks(this.appHostService.app);
    await this.mongoDBService.enableShutdownHooks(this.appHostService.app);
  }

  private async _configurateBullBoard() {
    const bullBoardUserName = this.configurationService.bullBoard.username;
    const bullBoardPassword = this.configurationService.bullBoard.password;

    passport.use(
      new BasicStrategy((username, password, done) => {
        if (username === bullBoardUserName && password === bullBoardPassword) {
          done(null, true);
        } else {
          done(null, false);
        }
      }),
    );

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    const queues = getBullBoardQueues();

    createBullBoard({
      queues,
      serverAdapter,
    });

    this.appHostService.app.use(
      '/admin/queues',
      passport.authenticate('basic', {
        session: false,
      }),
      serverAdapter.getRouter(),
    );
  }

  // private async _configurateRedis(app: INestApplication) {
  //   const redisIoAdapter = new RedisIoAdapter(app);
  //   await redisIoAdapter.connectToRedis();
  //   this.app.useWebSocketAdapter(redisIoAdapter);
  // }

  async main(): Promise<void> {
    this.appHostService.app.use(cookieParser());

    await this._loadTranslations();
    await this._loadDatabases();
    await this._configurateBullBoard();
    // await this._configurateRedis();

    await this.appHostService.app.listen(this.port, this.listenOrigin);

    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => this.appHostService.app.close());
    }

    this.debugService.debug(
      `Niro Health is running in "${this.configurationService.NODE_ENV}" mode at version "${this.configurationService.VERSION}".`,
    );
    this.debugService.debug(
      `Read the documentation at [Niro Health](https://guilhermesantos.gitbook.io/niro-health/)`,
    );
    this.debugService.verbose(
      `Thanks for using Niro Health. If you like it, please give us a star on [GitHub](https://github.com/Lack-Zillions-Over/niro-health)`,
    );
  }
}
