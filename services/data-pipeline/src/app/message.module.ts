import { UtilModule as BaseUtilModule } from '@amara/helpers/util';
import { Module } from '@nestjs/common';

import { ChatModule } from './chat/chat.module';
import { JobModule } from './job/job.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { UtilModule } from './util/util.module';

@Module({
  imports: [BaseUtilModule, UtilModule, JobModule, ChatModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
