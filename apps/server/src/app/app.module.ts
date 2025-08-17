import { UtilModule } from '@amara/helpers/util';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { ChatModule } from './chat/chat.module';
import { JobModule } from './job/job.module';

@Module({
  imports: [UtilModule, JobModule, ChatModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
