import { Module } from '@nestjs/common';
import { JsonWebTokenService } from './json-web-token.service';

@Module({
  providers: [JsonWebTokenService],
  exports: [JsonWebTokenService],
})
export class JsonWebTokenModule {}
