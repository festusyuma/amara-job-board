import { DbModule } from '@amara/db';
import { Module } from '@nestjs/common';

import { JobService } from './job.service';

@Module({
  imports: [DbModule],
  providers: [JobService],
  exports: [JobService]
})
export class JobModule {

}
