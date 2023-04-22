import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';

export type Type = 'full' | '50%' | 'any-one';

export interface ISimilarityFilterService {
  execute<Source>(
    filter: RecursivePartial<Source>,
    source: Source,
    similarity?: Type,
  ): boolean;
}
