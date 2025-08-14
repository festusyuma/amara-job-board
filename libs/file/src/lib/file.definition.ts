import { ConfigurableModuleBuilder } from '@nestjs/common';

import type { DBOptions, S3Options } from './types';

export type FileModuleProps = Partial<DBOptions> & S3Options;

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<FileModuleProps>().build();
