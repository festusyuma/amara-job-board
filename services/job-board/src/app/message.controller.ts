import { type MessagePayload, MessageType } from '@amara/types';
import { Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

/**
 * Create specific handlers to add custom logic in between
 * */

export class MessageController {
  @MessagePattern(MessageType.JOB_POSTED)
  jobPosted(payload: MessagePayload<typeof MessageType.JOB_POSTED>) {
    Logger.log("Job board: job posted");
    return { success: true, payload };
  }

  @MessagePattern(MessageType.JOB_UPDATED)
  jobUpdated(payload: MessagePayload<typeof MessageType.JOB_POSTED>) {
    Logger.log("Job board: job updated");
    return { success: true, payload };
  }
}
