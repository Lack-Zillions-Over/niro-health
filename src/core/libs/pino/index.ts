import pino, { Logger } from 'pino';
import pinoPretty, { PrettyOptions } from 'pino-pretty';

export class Pino {
  private _logger: Logger<PrettyOptions>;

  constructor(options: PrettyOptions) {
    this._logger = pino(pinoPretty(options));
  }

  get logger(): Logger<PrettyOptions> {
    return this._logger;
  }

  public info<T>(obj: T, msg: string, ...args: any[]): void {
    this.logger.info(obj, msg, ...args);
  }

  public warn<T>(obj: T, msg: string, ...args: any[]): void {
    this.logger.warn(obj, msg, ...args);
  }

  public error<T>(obj: T, msg: string, ...args: any[]): void {
    this.logger.error(obj, msg, ...args);
  }

  public debug<T>(obj: T, msg: string, ...args: any[]): void {
    this.logger.debug(obj, msg, ...args);
  }

  public trace<T>(obj: T, msg: string, ...args: any[]): void {
    this.logger.trace(obj, msg, ...args);
  }

  public fatal<T>(obj: T, msg: string, ...args: any[]): void {
    this.logger.fatal(obj, msg, ...args);
  }
}
