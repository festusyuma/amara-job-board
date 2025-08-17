import { DbModule } from '@amara/db';
import { Module } from '@nestjs/common';

import { ChatService } from './chat.service';

@Module({
  imports: [DbModule],
  providers: [ChatService],
  exports: [ChatService]
})
export class ChatModule {

}
