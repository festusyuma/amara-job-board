import { DynamicModule, Module } from '@nestjs/common';

import { FileController } from './file.controller';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  OPTIONS_TYPE,
} from './file.definition';
import { DynamoService } from './service/dynamo.service';
import { FileService } from './service/file.service';
import { S3Service } from './service/s3.service';

@Module({
  controllers: [FileController],
  providers: [S3Service, FileService, DynamoService],
  exports: [FileService],
})
export class FileModule extends ConfigurableModuleClass {
  register(options: typeof OPTIONS_TYPE): DynamicModule {
    return {
      ...super.register(options),
    };
  }

  registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      ...super.registerAsync(options),
    };
  }
}
