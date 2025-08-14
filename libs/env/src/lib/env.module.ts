import { DynamicModule, Module } from '@nestjs/common';

import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ModuleProps,
  OPTIONS_TYPE,
  ParsedEnv,
} from './env.definition';
import { SecretsService } from './services/secrets.service';

@Module({
  providers: [
    SecretsService,
    {
      provide: ParsedEnv,
      useFactory: async (secrets: SecretsService, moduleProps: ModuleProps) => {
        const secretsValues: Record<string, unknown> = {};

        if (moduleProps.secretNames?.length) {
          Object.assign(
            secretsValues,
            await secrets.loadSecrets(moduleProps.secretNames)
          );
        }

        return moduleProps.schema.parse({ ...secretsValues, ...process.env });
      },
      inject: [SecretsService, MODULE_OPTIONS_TOKEN],
    },
  ],
  exports: [ParsedEnv],
})
export class EnvModule extends ConfigurableModuleClass {
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
