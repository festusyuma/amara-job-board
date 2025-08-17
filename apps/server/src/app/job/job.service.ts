import { SnsService } from '@amara/helpers/util';
import { JobPost, MessageType, ParsedJobPost } from '@amara/types';
import { Body } from '@fy-tools/rpc-server';
import { Injectable, Logger } from '@nestjs/common';
import { v4 } from 'uuid';

import { createJob } from '../schema/schema';

@Injectable()
export class JobService {
  constructor(private event: SnsService) {}

  async createJob(payload: Body<createJob>) {
    // todo save to database
    Logger.log('created job :: ');

    await this.event.sendEvent({
      message: MessageType.JOB_POSTED,
      payload: Object.assign(payload, { id: v4() }),
    });
  }

  async updateJob(payload: Partial<JobPost & ParsedJobPost> & { id: string }) {
    // todo save to database
    Logger.log('update job :: ');
  }

  async fetchJobs() {
    // todo fetch from database
    return { data: [] };
  }
}
