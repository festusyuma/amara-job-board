import { UtilModule } from '@amara/helpers/util';
import { Module } from '@nestjs/common';

import { MessageController } from './message.controller';

@Module({
  imports: [UtilModule],
  controllers: [MessageController],
})
export class MessageModule {}
