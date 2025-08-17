import { SnsService } from '@amara/helpers/util';
import { type MessagePayload, MessageType } from '@amara/types';
import { Injectable } from '@nestjs/common';

import { ChatService } from './chat/chat.service';
import { JobService } from './job/job.service';

@Injectable()
export class MessageService {
  constructor(
    private parser: JobService,
    private chat: ChatService,
    private event: SnsService
  ) {}

  async parseJobPost(data: MessagePayload<typeof MessageType.PARSE_JOB>) {
    const parsed = await this.parser.parseJob(data);

    await this.event.sendEvent({
      message: MessageType.JOB_PARSED,
      payload: parsed,
    });
  }

  async handleNewMessage(
    data: MessagePayload<typeof MessageType.NEW_CHAT_MESSAGE>
  ) {
    const message = await this.chat.respond(data);

    await this.event.sendEvent({
      message: MessageType.NEW_CHAT_RESPONSE,
      payload: {
        id: data.id,
        message,
        chatId: data.chatId,
        files: [],
        createdAt: new Date().toISOString(),
      },
    });
  }
}
