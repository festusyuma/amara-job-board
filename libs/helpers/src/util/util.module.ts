import { EnvModule } from '@amara/env';
import { FileModule } from '@amara/file';
import { Global, Module } from '@nestjs/common';

import { EnvSchema, EnvService } from './env.service';
import { SnsService } from './sns.service';

@Global()
@Module({
  imports: [
    EnvModule.register({
      secretNames: [process.env['SECRET_NAME']],
      schema: EnvSchema,
    }),
    FileModule.registerAsync({
      imports: [],
      async useFactory(env: EnvService) {
        return {
          bucketName: env.get('STORAGE_NAME'),
          storageDomain: env.get('STORAGE_DOMAIN'),
        };
      },
      inject: [EnvService],
    }),
  ],
  providers: [EnvService, SnsService],
  exports: [EnvService, SnsService],
})
export class UtilModule {}
