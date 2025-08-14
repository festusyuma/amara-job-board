import { Controller } from '@fy-tools/rpc-server-nestjs';

import { Schema } from '../schema';

export const fileController = new Controller(Schema);

export const initUploadRoute = fileController.R.$post_INIT_UPLOAD;
export type initUploadRoute = typeof initUploadRoute._schema;

export const completeUploadRoute = fileController.R.$patch_COMPLETE_UPLOAD;
export type completeUploadRoute = typeof completeUploadRoute._schema;

export const getUrlRoute = fileController.R.$get_GET_URL;
export type getUrlRoute = typeof getUrlRoute._schema;
