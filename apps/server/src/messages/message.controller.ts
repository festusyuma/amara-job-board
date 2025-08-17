import { MessagePayload, MessageType } from '@amara/types';
import { MessagePattern } from '@nestjs/microservices';

import { JobService } from '../app/job/job.service';

export class MessageController {

  constructor(private jobBoardService: JobService) {
  }

  @MessagePattern(MessageType.JOB_PARSED)
  async testEvent(payload: MessagePayload<typeof MessageType.JOB_PARSED>) {
    await this.jobBoardService.updateJob(payload)
    return { success: true }
  }
}
