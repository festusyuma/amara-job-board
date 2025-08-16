import { Logger } from '@nestjs/common';
import type { Handler,SQSEvent } from 'aws-lambda'

import type { PlaceholderTransporter } from '../placeholder-transporter';

export function sqsHandler(app: Promise<PlaceholderTransporter>): Handler<SQSEvent> {
  return async (event, context, cb) => {
    const transporter = await app;

    for (const record of event.Records) {
      Logger.log(record, 'event');

      const event = JSON.parse(record.body);

      const handler = transporter.getHandlerByPattern(event.message);
      await handler?.(event.payload, context);
    }
  };
}
