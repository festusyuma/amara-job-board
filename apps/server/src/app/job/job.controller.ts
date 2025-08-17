import type { Body } from '@fy-tools/rpc-server';

import { createJob, fetchJobs, jobBoardController } from '../schema/schema';
import { JobService } from './job.service';

@jobBoardController.Controller
export class JobController {

  constructor(private service: JobService) {
  }

  @createJob.Handler
  async postJob(@createJob.Body() body: Body<createJob>) {
    await this.service.createJob(body);
    return { success: true }
  }

  @fetchJobs.Handler
  async getJobs() {
    return this.service.fetchJobs();
  }
}
