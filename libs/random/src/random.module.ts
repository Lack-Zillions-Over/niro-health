import { Module } from '@nestjs/common';
import { RandomService } from './random.service';
import { StringExService } from '@app/string-ex';

@Module({
  providers: [
    RandomService,
    { provide: 'IStringExService', useClass: StringExService },
  ],
  exports: [RandomService],
})
export class RandomModule {}
