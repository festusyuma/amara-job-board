import { JobPost, JobPostBoardSyncStatusUpdate } from './job.js';

export const MessageType = {
  JOB_POSTED: 'JOB_POSTED',
  JOB_UPDATED: 'JOB_UPDATED',
  JOB_SYNC_UPDATED: 'JOB_SYNC_UPDATED',
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export type Message =
  | { message: typeof MessageType.JOB_POSTED; payload: JobPost }
  | {
      message: typeof MessageType.JOB_SYNC_UPDATED;
      payload: JobPostBoardSyncStatusUpdate;
    };

export type MessageContext = { user: string };

export type ReceivedMessage<T extends Message> = T & {
  context: MessageContext;
};
