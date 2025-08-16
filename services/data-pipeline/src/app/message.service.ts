import { SnsService } from '@amara/helpers/util';
import { JobPost, MessageType } from '@amara/types';
import { Injectable } from '@nestjs/common';

import { JobDb } from './db/job.db';
import { ParserService } from './parser/parser.service';

@Injectable()
export class MessageService {
  constructor(
    private parser: ParserService,
    private jobDb: JobDb,
    private event: SnsService
  ) {}

  async parseJobPost(data: JobPost) {
    const parsed = await this.parser.parseJob(data);

    await this.jobDb.save(parsed);

    await this.event.sendEvent({
      message: MessageType.JOB_PARSED,
      payload: parsed,
    });
  }
}
