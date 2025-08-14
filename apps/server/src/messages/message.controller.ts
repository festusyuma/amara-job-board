import { MessagePattern } from '@nestjs/microservices';

export class MessageController {
  @MessagePattern("TEST")
  testEvent() {
    return { success: true }
  }
}
