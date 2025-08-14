import { Global, Module } from '@nestjs/common';

import { DbService } from './db.service';
import { DynamoService } from './dynamo.service';

@Global()
@Module({
  providers: [DbService, DynamoService],
  exports: [DbService, DynamoService],
})
export class DbModule {}
