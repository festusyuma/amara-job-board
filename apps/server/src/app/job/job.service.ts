import { JobTable } from '@amara/db';
import { SnsService } from '@amara/helpers/util';
import { JobPost, MessageType, ParsedJobPost } from '@amara/types';
import { Body } from '@fy-tools/rpc-server';
import { Injectable, Logger } from '@nestjs/common';
import { v4 } from 'uuid';

import { createJob } from '../schema/schema';

@Injectable()
export class JobService {
  constructor(private event: SnsService, private jobTable: JobTable) {}

  async createJob(payload: Body<createJob>) {
    const job = {
      id: v4(),
      name: payload.name,
      description: payload.description,
    };

    await this.jobTable.create(job);

    await this.event.sendEvent({
      message: MessageType.PARSE_JOB,
      payload: job,
    });
  }

  async updateJob(payload: Partial<JobPost & ParsedJobPost> & { id: string }) {
    // todo save to database
    Logger.log('update job :: ');
  }

  async fetchJobs() {
    const jobs = await this.jobTable.findAll();
    return { data: jobs };
  }
}
