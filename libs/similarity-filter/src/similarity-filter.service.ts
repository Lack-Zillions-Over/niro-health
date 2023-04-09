import { Injectable } from '@nestjs/common';

import { SimilarityFilter } from '@app/similarity-filter/similarity-filter.interface';
import { RecursivePartial } from '@app/core/common/types/recursive-partial.type';

import * as _ from 'lodash';

@Injectable()
export class SimilarityFilterService implements SimilarityFilter.Class {
  public execute<Source>(
    filter: RecursivePartial<Source>,
    source: Source,
    similarity?: SimilarityFilter.Type,
  ): boolean {
    const optionsEqual = [];
    let response = false;

    similarity = similarity || 'full';

    for (const option in filter) {
      let equal;

      if (typeof filter[option] === 'object') {
        equal = this.execute(
          filter[option] as RecursivePartial<Source>,
          source[option] as Source,
          similarity,
        );
      } else {
        equal = _.isEqual(filter[option], source[option]);
      }

      if (equal) optionsEqual.push(equal);
    }

    const filterToSimilarity = Object.keys(filter).filter(
      (key) => typeof filter[key] !== 'object',
    );

    if (filterToSimilarity.length <= 0 && optionsEqual.length > 0) {
      return true;
    } else if (filterToSimilarity.length <= 0 && optionsEqual.length <= 0) {
      return false;
    }

    if (similarity === 'full') {
      if (optionsEqual.length === filterToSimilarity.length) {
        response = true;
      }
    } else if (similarity === '50%') {
      if (
        (filterToSimilarity.length / 2 < 1 && optionsEqual.length > 0) ||
        optionsEqual.length === filterToSimilarity.length / 2
      ) {
        response = true;
      }
    } else if (similarity === 'any-one') {
      if (optionsEqual.length >= 1) {
        response = true;
      }
    }

    return response;
  }
}
