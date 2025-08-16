import { Module } from '@nestjs/common';

import { DbModule } from '../db/db.module';
import { ChatService } from './chat.service';

@Module({
  imports: [DbModule],
  providers: [ChatService],
  exports: [ChatService]
})
export class ChatModule {

}
