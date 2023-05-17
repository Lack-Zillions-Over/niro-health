import { Injectable, Inject } from '@nestjs/common';
import * as moment from 'moment-timezone';
import type { MomentInput, MomentFormatSpecification } from 'moment';

import type { IDateExService } from '@app/date-ex';
import type { IConfigurationService } from '@app/configuration';

/**
 * @description The module that handles date and time operations.
 */

@Injectable()
export class DateExService implements IDateExService {
  constructor(
    @Inject('IConfigurationService')
    private readonly configurationService: IConfigurationService,
  ) {}

  /**
   * @description Returns a new moment object, which is a wrapper for the Date object.
   */
  public moment(
    inp?: MomentInput,
    format?: MomentFormatSpecification,
    strict?: boolean,
    language?: string,
  ): moment.Moment {
    return moment(inp, format, language, strict).tz(
      this.configurationService.TZ,
    );
  }

  /**
   * @description Returns the current date and time.
   */
  get now(): Date {
    return this.moment().toDate();
  }

  /**
   * @description Returns the current date and time in UTC.
   */
  get utc(): Date {
    return this.moment().utc().toDate();
  }

  /**
   * @description Returns the date with the subtraction of seven days.
   */
  get sevenDaysAgo(): Date {
    return this.moment().subtract(7, 'days').toDate();
  }

  /**
   * @description Returns the date with the addition of seven days.
   */
  get sevenDaysFromNow(): Date {
    return this.moment().add(7, 'days').toDate();
  }

  /**
   * @description Returns the date with the subtraction of one month.
   */
  get oneMonthAgo(): Date {
    return this.moment().subtract(1, 'months').toDate();
  }

  /**
   * @description Returns the date with the addition of one month.
   */
  get oneMonthFromNow(): Date {
    return this.moment().add(1, 'months').toDate();
  }

  /**
   * @description Returns the date with the subtraction of one year.
   */
  get oneYearAgo(): Date {
    return this.moment().subtract(1, 'years').toDate();
  }

  /**
   * @description Returns the date with the addition of one year.
   */
  get oneYearFromNow(): Date {
    return this.moment().add(1, 'years').toDate();
  }
}
