import { UtilModule } from '@amara/helpers/util';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { JobBoardModule } from './job-board/job-board.module';

@Module({
  imports: [UtilModule, JobBoardModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
