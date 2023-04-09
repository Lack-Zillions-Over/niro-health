import { INestApplication, Injectable } from '@nestjs/common';

import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';

import { BasicStrategy } from 'passport-http';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';

import { getBullBoardQueues } from '@app/core/bull/bull-board-queue';
import { ConfigurationService } from '@app/configuration';
import { DebugService } from '@app/debug';
import { I18nService } from '@app/i18n';
import { PrismaService } from '@app/core/prisma/prisma.service';
import { MongoDBService } from '@app/core/mongodb/mongodb.service';
// import { RedisIoAdapter } from '@app/websockets/adapters/redis-io.adapter';
import { Bootstrap } from '@app/bootstrap/bootstrap.interface';

import { EN, PT_BR } from '@app/bootstrap/translations';

declare const module: {
  hot: {
    accept: Bootstrap.acceptFunc;
    dispose: Bootstrap.disposeFunc;
  };
};

@Injectable()
export class BootstrapService implements Bootstrap.Class {
  app: INestApplication;

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly debugService: DebugService,
    private readonly i18nService: I18nService,
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
    this.configurationService.setVariable('files_path', 'uploads');
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
    const prismaService = this.app.get(PrismaService);
    const mongoDBService = this.app.get(MongoDBService);
    await prismaService.enableShutdownHooks(this.app);
    await mongoDBService.enableShutdownHooks(this.app);
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

    this.app.use(
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
    this.debugService.debug(
      `Niro Health is running in "${this.configurationService.NODE_ENV}" mode at version "${this.configurationService.VERSION}".`,
    );
    this.debugService.debug(
      `Read the documentation at [Niro Health](https://guilhermesantos.gitbook.io/niro-health/)`,
    );
    this.debugService.verbose(
      `Thanks for using Niro Health. If you like it, please give us a star on [GitHub](https://github.com/Lack-Zillions-Over/niro-health)`,
    );

    this.app.use(cookieParser());

    await this._loadTranslations();
    await this._loadDatabases();
    await this._configurateBullBoard();
    // await this._configurateRedis();

    await this.app.listen(this.port, this.listenOrigin);

    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => this.app.close());
    }
  }
}
