import { Moment as MomentType } from 'moment';

export interface Options {
  layout?: string;
  exclude?: string;
}

export interface IDateExService {
  instance(): MomentType;
  format(options?: Options): string;
  formatDate(date: string): MomentType;
}
