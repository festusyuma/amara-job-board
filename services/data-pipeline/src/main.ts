import { getTransporter } from '@amara/helpers/microservice';
import { sqsHandler } from '@amara/helpers/microservice/handlers/sqs';
import { Logger } from '@nestjs/common';
import { Handler, SQSEvent } from 'aws-lambda';

import { MessageModule } from './app/message.module';

const app = getTransporter(MessageModule);

export const handlerv2 = sqsHandler(app);

export const handler: Handler<SQSEvent> = async (event, context) => {
  const transporter = await app;

  for (const record of event.Records) {
    const message = JSON.parse(record.body);
    const snsMessage = JSON.parse(message.Message);
    Logger.log(message, 'event');

    const handler = transporter.getHandlerByPattern(snsMessage.message);
    await handler?.(snsMessage.data, context);
  }
};
