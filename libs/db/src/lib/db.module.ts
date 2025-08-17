import { Module } from '@nestjs/common';

import { DynamoService } from './dynamo.service';
import { ChatTable } from './tables/chat.table';
import { ChatMessageTable } from './tables/chat-message.table';
import { JobTable } from './tables/job.table';

@Module({
  providers: [DynamoService, JobTable, ChatTable, ChatMessageTable],
  exports: [JobTable, ChatTable, ChatMessageTable],
})
export class DbModule {}
