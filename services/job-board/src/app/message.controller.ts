import { type MessagePayload, MessageType } from '@amara/types';
import { MessagePattern } from '@nestjs/microservices';

/**
 * Create specific handlers to add custom logic in between
 * */

export class MessageController {
  @MessagePattern(MessageType.JOB_POSTED)
  jobPosted(payload: MessagePayload<typeof MessageType.JOB_POSTED>) {
    return { success: true, payload };
  }

  @MessagePattern(MessageType.JOB_UPDATED)
  jobUpdated(payload: MessagePayload<typeof MessageType.JOB_POSTED>) {
    return { success: true, payload };
  }
}
