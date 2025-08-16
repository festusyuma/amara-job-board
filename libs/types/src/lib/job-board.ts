import { JobPost, JobPostBoardSyncStatusUpdate } from './job.js';

export interface JobBoard {
  board: string,
  createPost(data: JobPost): void;
  updatePost(data: unknown): JobPostBoardSyncStatusUpdate;
  webhook(data: unknown): void
}
