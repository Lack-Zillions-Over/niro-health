import { Injectable, Logger } from '@nestjs/common';
import { Debug } from '@app/debug/debug.interface';

@Injectable()
export class DebugService implements Debug.Class {
  public log(msg: string, ...optionalParams: [...any, string?]): void {
    Logger.log(msg, ...optionalParams);
  }

  public warn(msg: string, ...optionalParams: [...any, string?]): void {
    Logger.warn(msg, ...optionalParams);
  }

  public error(msg: string, ...optionalParams: [...any, string?]): void {
    Logger.error(msg, ...optionalParams);
  }

  public debug(msg: string, ...optionalParams: [...any, string?]): void {
    Logger.debug(msg, ...optionalParams);
  }

  public verbose(msg: string, ...optionalParams: [...any, string?]): void {
    Logger.verbose(msg, ...optionalParams);
  }
}
