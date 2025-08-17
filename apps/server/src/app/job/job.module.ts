import { DbModule } from '@amara/db';
import { Module } from '@nestjs/common';

import { JobController } from './job.controller';
import { JobService } from './job.service';

@Module({
  imports: [DbModule],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
