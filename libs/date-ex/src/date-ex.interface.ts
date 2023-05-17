import type { Moment, MomentInput, MomentFormatSpecification } from 'moment';

export interface IDateExService {
  moment(
    inp?: MomentInput,
    format?: MomentFormatSpecification,
    strict?: boolean,
    language?: string,
  ): Moment;
  now: Date;
  utc: Date;
  sevenDaysAgo: Date;
  sevenDaysFromNow: Date;
  oneMonthAgo: Date;
  oneMonthFromNow: Date;
  oneYearAgo: Date;
  oneYearFromNow: Date;
}
