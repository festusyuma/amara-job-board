export type JobPost = {
  name: string;
  description: string;
  status: JobPostBoardSyncStatus;
};

export const JobPostBoardSyncStatus = {
  PENDING: 'PENDING',
};

export type JobPostBoardSyncStatus =
  (typeof JobPostBoardSyncStatus)[keyof typeof JobPostBoardSyncStatus];

export type JobPostBoardSyncStatusUpdate = {
  id: string;
  status: JobPostBoardSyncStatus;
};
