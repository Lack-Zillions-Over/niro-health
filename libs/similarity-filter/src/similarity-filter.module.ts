import { Module } from '@nestjs/common';
import { SimilarityFilterService } from './similarity-filter.service';

@Module({
  providers: [SimilarityFilterService],
  exports: [SimilarityFilterService],
})
export class SimilarityFilterModule {}
