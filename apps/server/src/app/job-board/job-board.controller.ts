import { Body } from '@fy-tools/rpc-server';

import { createJob, fetchJobs, jobBoardController } from '../schema/schema';
import { JobBoardService } from './job-board.service';

@jobBoardController.Controller
export class JobBoardController {

  constructor(private service: JobBoardService) {
  }

  @createJob.Handler
  async postJob(body: Body<createJob>) {
    await this.service.createJob(body);
    return { success: true }
  }

  @fetchJobs.Handler
  async getJobs() {
    return this.service.fetchJobs();
  }
}
