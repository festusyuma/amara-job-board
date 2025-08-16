import { SnsService } from '@amara/helpers/util';
import { MessageType } from '@amara/types';
import { Body } from '@fy-tools/rpc-server';
import { Injectable, Logger } from '@nestjs/common';

import { createJob } from '../schema/schema';

@Injectable()
export class JobBoardService {
  constructor(private event: SnsService) {}

  async createJob(payload: Body<createJob>) {
    // todo save to database
    Logger.log('created job :: ');

    await this.event.sendEvent({
      message: MessageType.JOB_POSTED,
      payload: payload,
    });
  }

  async fetchJobs() {
    // todo fetch from database

    return { data: [] }
  }
}
