import { RecursivePartial } from '@app/core/common/types/recursive-partial.type';

export declare namespace SimilarityFilter {
  export type Type = 'full' | '50%' | 'any-one';

  export interface Class {
    execute<Source>(
      filter: RecursivePartial<Source>,
      source: Source,
      similarity?: Type,
    ): boolean;
  }
}
