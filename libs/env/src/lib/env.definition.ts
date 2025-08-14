import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ZodObject, ZodRawShape } from 'zod';
import { ZodMiniObject } from 'zod/v4/mini';

export type ModuleProps = {
  secretNames?: (string | undefined)[];
  schema: ZodObject<ZodRawShape> | ZodMiniObject<ZodRawShape>;
};

export const ParsedEnv = Symbol('ParsedEnv');

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<ModuleProps>().build();
