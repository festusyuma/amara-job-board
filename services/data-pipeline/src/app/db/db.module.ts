import { Module } from '@nestjs/common';

import { DynamoService } from './dynamo.service';
import { JobDb } from './job.db';

@Module({
  providers: [DynamoService, JobDb],
  exports: [JobDb]
})
export class DbModule {

}
