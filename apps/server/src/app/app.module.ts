import { UtilModule } from '@amara/helpers/util';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { JobModule } from './job/job.module';

@Module({
  imports: [UtilModule, JobModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
