import type { Body } from '@fy-tools/rpc-server';
import { HttpException } from '@nestjs/common';

import {
  completeUploadRoute,
  fileController,
  getUrlRoute,
  initUploadRoute,
} from './file.schema';
import { FileService } from './service/file.service';

@fileController.Controller
export class FileController {
  constructor(private service: FileService) {}

  @initUploadRoute.Handler
  initUpload(@initUploadRoute.Body() body: Body<initUploadRoute>) {
    if (body.multipart) return this.service.initClientUpload(body);
    else return this.service.initClientSingleUpload(body);
  }

  @completeUploadRoute.Handler
  completeUpload(@completeUploadRoute.Body() body: Body<completeUploadRoute>) {
    return this.service.completeClientUpload(body);
  }

  @getUrlRoute.Handler
  getUrl(@getUrlRoute.Query('key') query: string) {
    if (!query.startsWith('public')) {
      throw new HttpException({ message: 'forbidden' }, 403);
    }

    return this.service.getFileUrl(query);
  }
}
