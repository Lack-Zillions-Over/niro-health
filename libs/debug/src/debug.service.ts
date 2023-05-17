import { Injectable, Logger } from '@nestjs/common';
import type { IDebugService } from '@app/debug';

/**
 * @description The module provides a wrapper for the NestJS Logger.
 */
@Injectable()
export class DebugService implements IDebugService {
  /**
   * @description The method logs a message with the level `log`.
   */
  public log(msg: string, ...optionalParams: [...any, string?]): void {
    Logger.log(msg, ...optionalParams);
  }

  /**
   * @description The method logs a message with the level `warn`.
   */
  public warn(msg: string, ...optionalParams: [...any, string?]): void {
    Logger.warn(msg, ...optionalParams);
  }

  /**
   * @description The method logs a message with the level `error`.
   */
  public error(msg: string, ...optionalParams: [...any, string?]): void {
    Logger.error(msg, ...optionalParams);
  }

  /**
   * @description The method logs a message with the level `debug`.
   */
  public debug(msg: string, ...optionalParams: [...any, string?]): void {
    Logger.debug(msg, ...optionalParams);
  }

  /**
   * @description The method logs a message with the level `verbose`.
   */
  public verbose(msg: string, ...optionalParams: [...any, string?]): void {
    Logger.verbose(msg, ...optionalParams);
  }
}
