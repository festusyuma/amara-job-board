import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { MicroserviceOptions } from '@nestjs/microservices';
import type { Handler, SQSEvent } from 'aws-lambda';

import { MessageModule } from './messages/message.module';
import { PlaceholderTransporter } from './messages/message.transporter';

async function bootstrap() {
  const strategy = new PlaceholderTransporter();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MessageModule,
    { strategy }
  );

  await app.init();

  return strategy;
}

const app = bootstrap();

export const handler: Handler<SQSEvent> = async (event, context, cb) => {
  const transporter = await app;

  for (const record of event.Records) {
    const message = JSON.parse(record.body);
    const snsMessage = JSON.parse(message.Message);
    Logger.log(message, 'event');

    const handler = transporter.getHandlerByPattern(snsMessage.message);
    await handler?.(snsMessage.data, context);
  }
};
