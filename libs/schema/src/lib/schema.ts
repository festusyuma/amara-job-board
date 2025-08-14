import { Schema as FileSchema } from '@amara/file/schema';
import { App } from '@fy-tools/rpc-server';

export const Schema = new App().controller(FileSchema);
