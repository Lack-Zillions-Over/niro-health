import { Moment as MomentType } from 'moment';

export declare namespace DateEx {
  export interface Options {
    layout?: string;
    exclude?: string;
  }

  export interface Class {
    instance(): MomentType;
    format(options?: Options): string;
    formatDate(date: string): MomentType;
  }
}
