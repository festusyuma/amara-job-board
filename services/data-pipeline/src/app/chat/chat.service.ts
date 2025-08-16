import { Injectable, Logger } from '@nestjs/common';

import { JobDb } from '../db/job.db';

@Injectable()
export class ChatService {

  constructor(private jobDb: JobDb) {
  }


  respond(data: { message: string }) {
    Logger.log("responded")
  }

}
