import { Logger } from '@nestjs/common';
import type { Handler,SQSEvent } from 'aws-lambda'

import type { PlaceholderTransporter } from '../placeholder-transporter';

export function sqsHandler(app: Promise<PlaceholderTransporter>): Handler<SQSEvent> {
  return async (event, context, cb) => {
    const transporter = await app;

    for (const record of event.Records) {
      Logger.log(record.body, 'event');

      const message = JSON.parse(record.body);
      const snsMessage = JSON.parse(message.Message);

      const handler = transporter.getHandlerByPattern(snsMessage.message);
      await handler?.(snsMessage.data, context);
    }
  };
}
