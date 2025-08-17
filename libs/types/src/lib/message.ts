import { ChatMessage } from './chat.js';
import { JobPost, JobPostBoardSyncStatusUpdate, ParsedJobPost } from './job.js';

export const MessageType = {
  JOB_POSTED: 'JOB_POSTED',
  JOB_UPDATED: 'JOB_UPDATED',
  PARSE_JOB: 'PARSE_JOB',
  JOB_PARSED: 'JOB_PARSED',
  JOB_APPLICATION: 'JOB_APPLICATION',
  JOB_APPLICATION_PARSED: 'JOB_APPLICATION_PARSED',
  JOB_BOARD_UPDATED: 'JOB_BOARD_UPDATED',
  JOB_SYNC: 'JOB_SYNC',
  JOB_SYNC_UPDATED: 'JOB_SYNC_UPDATED',
  NEW_CHAT_MESSAGE: 'NEW_CHAT_MESSAGE',
  NEW_CHAT_RESPONSE: 'NEW_CHAT_RESPONSE',
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export type Message =
  | {
      message: typeof MessageType.PARSE_JOB;
      payload: Omit<JobPost, 'id' | 'status'>;
    }
  | {
      message: typeof MessageType.JOB_POSTED;
      payload: Omit<JobPost, 'id' | 'status'>;
    }
  | {
      message: typeof MessageType.JOB_PARSED;
      payload: ParsedJobPost & { id: string };
    }
  | { message: typeof MessageType.JOB_SYNC; payload: ParsedJobPost & JobPost }
  | { message: typeof MessageType.NEW_CHAT_MESSAGE; payload: ChatMessage }
  | { message: typeof MessageType.NEW_CHAT_RESPONSE; payload: ChatMessage }
  | { message: typeof MessageType.JOB_APPLICATION; payload: JobPost }
  | { message: typeof MessageType.JOB_APPLICATION_PARSED; payload: JobPost }
  | {
      message: typeof MessageType.JOB_SYNC_UPDATED;
      payload: JobPostBoardSyncStatusUpdate;
    };

export type MessagePayload<T extends MessageType> = Extract<
  Message,
  { message: T }
>['payload'];

export type MessageContext = { user: string };

export type ReceivedMessage<T extends Message> = T & {
  context: MessageContext;
};
