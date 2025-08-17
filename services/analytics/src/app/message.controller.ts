import type { MessageType } from '@amara/types';
import { Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

/**
 * Create specific handlers to add custom logic in between
 * */

export class MessageController {
  /**
   * Default analytics operation goes here
   * */
  @MessagePattern('*')
  testEvent(payload: unknown, message: MessageType) {
    Logger.log(`analytics event :: ${message}`);
    return { success: true, payload };
  }
}
