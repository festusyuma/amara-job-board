import { type MessagePayload, MessageType } from '@amara/types';
import { MessagePattern } from '@nestjs/microservices';

import { MessageService } from './message.service';

export class MessageController {
  constructor(private service: MessageService) {}

  @MessagePattern(MessageType.JOB_POSTED)
  async jobPosted(payload: MessagePayload<typeof MessageType.JOB_POSTED>) {
    await this.service.parseJobPost(payload);
    return { success: true };
  }

  @MessagePattern(MessageType.JOB_UPDATED)
  async jobUpdated(payload: MessagePayload<typeof MessageType.JOB_POSTED>) {
    await this.service.parseJobPost(payload);
    return { success: true, payload };
  }
}
