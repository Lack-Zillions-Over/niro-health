import { Injectable } from '@nestjs/common';

import pino, { Logger } from 'pino';
import pinoPretty, { PrettyOptions } from 'pino-pretty';

import { Debug } from '@app/debug/debug.interface';

export type PinoLogger = Logger<PrettyOptions>;

@Injectable()
export class DebugService implements Debug.Class<PinoLogger> {
  private _logger: PinoLogger;

  constructor() {
    this._logger = pino(
      pinoPretty({
        colorize: true,
      }),
    );
  }

  /**
   * `get logger(): Logger<PrettyOptions> { return this._logger; }`
   * @returns The logger property is being returned.
   */
  public logger() {
    return this._logger;
  }

  /**
   * It logs the object and the message to the console.
   * @param {T} obj - The object that you want to log.
   * @param {string} msg - The message to log.
   * @param {any[]} args - any[] - This is an array of any type.
   */
  public info<T>(obj: T, msg: string, ...args: any[]): void {
    this._logger.info(obj, msg, ...args);
  }

  /**
   * It logs a warning message.
   * @param {T} obj - The object that is being logged.
   * @param {string} msg - The message to log.
   * @param {any[]} args - any[] - This is an array of arguments that will be passed
   * to the logger.
   */
  public warn<T>(obj: T, msg: string, ...args: any[]): void {
    this._logger.warn(obj, msg, ...args);
  }

  /**
   * "Log an error message with an object."
   *
   * The first parameter is the object to log. The second parameter is the message to
   * log. The third parameter is a list of arguments to log
   * @param {T} obj - The object to log.
   * @param {string} msg - The message to log.
   * @param {any[]} args - any[] - This is an array of arguments that will be passed
   * to the logger.
   */
  public error<T>(obj: T, msg: string, ...args: any[]): void {
    this._logger.error(obj, msg, ...args);
  }

  /**
   * It logs the object and the message to the console.
   * @param {T} obj - The object to be logged.
   * @param {string} msg - The message to be logged.
   * @param {any[]} args - any[] - This is an array of arguments that will be passed
   * to the logger.
   */
  public debug<T>(obj: T, msg: string, ...args: any[]): void {
    this._logger.debug(obj, msg, ...args);
  }

  /**
   * It logs the object and the message to the console.
   * @param {T} obj - The object to log.
   * @param {string} msg - The message to log.
   * @param {any[]} args - any[] - This is an array of arguments that will be passed
   * to the logger.
   */
  public trace<T>(obj: T, msg: string, ...args: any[]): void {
    this._logger.trace(obj, msg, ...args);
  }

  /**
   * > The `fatal` function logs a fatal message
   * @param {T} obj - The object to log.
   * @param {string} msg - The message to log.
   * @param {any[]} args - any[] - any number of arguments to be logged
   */
  public fatal<T>(obj: T, msg: string, ...args: any[]): void {
    this._logger.fatal(obj, msg, ...args);
  }
}
