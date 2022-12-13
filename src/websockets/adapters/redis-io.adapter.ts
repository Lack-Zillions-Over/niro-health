import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

import { Pino } from '@/core/libs/pino';
import { redisOptions } from '@/core/constants';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private _url = redisOptions.url || `redis://localhost:6379`;
  private _pino = new Pino({ colorize: true });

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: this._url,
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options) as Server;
    const pino = this._pino;

    server.adapter(this.adapterConstructor);

    server.on('connection', (socket: Socket) => {
      pino.info({}, `Socket is connected: ${socket.id}`);
      socket.on('disconnect', () =>
        pino.info({}, `Socket is disconnected: ${socket.id}`),
      );
    });

    return server;
  }
}
