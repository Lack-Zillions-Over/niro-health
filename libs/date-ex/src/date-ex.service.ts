import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

import { DateEx } from '@app/date-ex/date-ex.interface';

@Injectable()
export class DateExService implements DateEx.Class {
  instance(): moment.Moment {
    return moment();
  }

  /**
   * @description Formats a date for the system locality with the options of layout and deleting some parts
   */
  public format(options?: DateEx.Options): string {
    if (!options?.exclude) return moment().format(options?.layout);
    else
      return moment().format(options?.layout).replace(options.exclude, ' || ');
  }

  /**
   * @description Formats the date to the standard Year, Month, Day
   */
  public formatDate(date: string) {
    const year = date.substring(0, 4),
      month = date.substring(4, 6),
      day = date.substring(6, 8);

    const result = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD');

    if (!result.isValid()) return moment();

    return result;
  }
}
