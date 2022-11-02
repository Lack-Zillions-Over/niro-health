import * as _ from 'lodash';

import { SimilarityFilter as Types } from '@/core/utils/similarityFilter/types';

export class SimilarityFilter implements Types.Class {
  public execute<Source>(
    filter: Partial<Source>,
    source: Source,
    similarity?: Types.SimilarityType,
  ): boolean {
    const optionsEqual = [];

    similarity = similarity || 'full';

    for (const option in filter) {
      let equal;

      if (typeof filter[option] === 'object') {
        equal = this.execute(filter[option], source[option], similarity);
      } else {
        equal = _.isEqual(filter[option], source[option]);
      }

      if (equal) optionsEqual.push(equal);
    }

    if (similarity === 'full') {
      if (optionsEqual.length === Object.keys(filter).length) {
        return true;
      }
    } else if (similarity === '50%') {
      if (optionsEqual.length === Object.keys(filter).length / 2) {
        return true;
      }
    } else if (similarity === 'any-one') {
      if (optionsEqual.length >= 1) {
        return true;
      }
    }

    return false;
  }
}
