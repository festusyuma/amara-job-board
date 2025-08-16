import { Schema } from '@amara/schema';
import { App } from '@fy-tools/rpc-server-nestjs';
import { OpenAPIV3 } from 'openapi-types';
import { toJSONSchema,ZodType } from 'zod';

const AppSchema = new App(Schema, {
  toJsonSchema(z: ZodType) {
    return toJSONSchema(z) as OpenAPIV3.SchemaObject
  }
})

export const jobBoardController = AppSchema.C.JOB__BOARD;

export const createJob = jobBoardController.R.$post_DEFAULT;
export type createJob = typeof createJob._schema;

export const fetchJobs = jobBoardController.R.$get_DEFAULT;
export type fetchJobs = typeof fetchJobs._schema;

export const chatController = AppSchema.C.CHAT;

export const sendMessage = chatController.R.$post_DEFAULT;
export type sendMessage = typeof sendMessage._schema;

export const fetchMessages = chatController.R.$get_DEFAULT;
export type fetchMessages = typeof fetchMessages._schema;

export const fetchChat = chatController.R['$get_:ID'];
export type fetchChat = typeof fetchChat._schema;
