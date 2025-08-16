import { UtilModule } from '@amara/helpers/util';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

@Module({
  imports: [UtilModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
