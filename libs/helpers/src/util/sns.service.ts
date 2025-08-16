import { Message } from '@amara/types';
import {
  PublishBatchCommand,
  PublishCommand,
  SNSClient,
} from '@aws-sdk/client-sns';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { EnvService } from './env.service';

@Injectable()
export class SnsService extends SNSClient {
  constructor(private env: EnvService) {
    super();
  }

  async sendEvent(data: Message | Message[]) {
    try {
      if (Array.isArray(data)) {
        await this.send(
          new PublishBatchCommand({
            PublishBatchRequestEntries: data.map((i) => ({
              Id: v4(),
              Message: JSON.stringify(i),
            })),
            TopicArn: this.env.get('EVENT_TOPIC'),
          })
        );
      } else {
        await this.send(
          new PublishCommand({
            Message: JSON.stringify(data),
            TopicArn: this.env.get('EVENT_TOPIC'),
          })
        );
      }
    } catch (e) {
      console.error('sns error :: ', e);
    }
  }
}
