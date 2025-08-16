import { UtilModule } from '@amara/helpers/util';
import { Module } from '@nestjs/common';

import { DbModule } from './db/db.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { ParserModule } from './parser/parser.module';

@Module({
  imports: [UtilModule, ParserModule, DbModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
