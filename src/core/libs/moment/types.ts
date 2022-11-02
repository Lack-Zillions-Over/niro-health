import { Moment as MomentType } from 'moment';

export declare namespace Moment {
  export interface Options {
    layout?: string;
    exclude?: string;
  }

  export interface Class {
    format(options?: Options): string;
    formatDate(date: string): MomentType;
  }
}
