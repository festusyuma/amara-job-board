import { JobPost, JobPostBoardSyncStatusUpdate } from './job.js';

export interface JobBoard {
  createPost(data: JobPost): void;
  updatePost(data: unknown): JobPostBoardSyncStatusUpdate;
}
