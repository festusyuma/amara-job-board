import { Module } from '@nestjs/common';

import { ModelService } from './model.service';
import { ParserService } from './parser.service';

@Module({
  providers: [ModelService, ParserService],
  exports: [ParserService]
})
export class ParserModule {

}
