import { type MessagePayload, MessageType } from '@amara/types';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { MessageService } from './message.service';

@Controller()
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
    return { success: true };
  }

  @MessagePattern(MessageType.NEW_CHAT_MESSAGE)
  async newChatMessage(
    payload: MessagePayload<typeof MessageType.NEW_CHAT_MESSAGE>
  ) {
    await this.service.handleNewMessage(payload);
    return { success: true };
  }
}
