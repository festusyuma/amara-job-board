import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { UtilModule } from './util/util.module';

@Module({
  imports: [UtilModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
