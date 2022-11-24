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

  public info(message: string, ...args: any[]): void {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    this.logger.warn(message, ...args);
  }

  public error(message: string, ...args: any[]): void {
    this.logger.error(message, ...args);
  }

  public debug(message: string, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }

  public trace(message: string, ...args: any[]): void {
    this.logger.trace(message, ...args);
  }

  public fatal(message: string, ...args: any[]): void {
    this.logger.fatal(message, ...args);
  }
}
