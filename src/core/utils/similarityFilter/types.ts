export declare namespace SimilarityFilter {
  export type SimilarityType = 'full' | '50%' | 'any-one';

  export interface Class {
    execute<Source>(
      filter: Partial<Source>,
      source: Source,
      similarity?: SimilarityType,
    ): boolean;
  }
}
