import { Module } from '@nestjs/common';

import { DynamoService } from './dynamo.service';
import { JobTable } from './tables/job.table';

@Module({
  providers: [DynamoService, JobTable],
  exports: [JobTable],
})
export class DbModule {}
