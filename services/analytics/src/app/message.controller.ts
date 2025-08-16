import type { Message } from "@amara/types"
import { MessagePattern } from '@nestjs/microservices';

/**
 * Create specific handlers to add custom logic in between
 * */

export class MessageController {
  @MessagePattern("DEFAULT")
  testEvent(payload: Message) {
    /**
     * Default analytics operation goes here
     * */
    return { success: true, payload }
  }
}
