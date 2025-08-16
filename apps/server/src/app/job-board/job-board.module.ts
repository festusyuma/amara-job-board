import { Module } from '@nestjs/common';

import { JobBoardController } from './job-board.controller';
import { JobBoardService } from './job-board.service';

@Module({
  controllers: [JobBoardController],
  providers: [JobBoardService],
  exports: [JobBoardService]
})
export class JobBoardModule {}
