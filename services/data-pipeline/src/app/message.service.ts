import { SnsService } from '@amara/helpers/util';
import { type MessagePayload, MessageType } from '@amara/types';
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

  async parseJobPost(data: MessagePayload<typeof MessageType.JOB_POSTED>) {
    const parsed = await this.parser.parseJob(data);

    await this.jobDb.save(parsed);

    await this.event.sendEvent({
      message: MessageType.JOB_PARSED,
      payload: parsed,
    });
  }

  async handleNewMessage(data: MessagePayload<typeof MessageType.NEW_CHAT_MESSAGE>) {
    // todo process message and emit response
  }
}
