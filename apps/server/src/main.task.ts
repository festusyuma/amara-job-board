import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

import { MessageModule } from './messages/message.module';
import { PlaceholderTransporter } from './messages/message.transporter';

async function bootstrap() {
  const strategy = new PlaceholderTransporter();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MessageModule,
    { strategy }
  );

  await app.init();

  const taskName = process.env.TASK_NAME;
  if (!taskName) throw new Error('task name is required');

  const payload = JSON.parse(process.env.PAYLOAD ?? '{}');
  const handler = strategy.getHandlerByPattern(taskName);

  Logger.log({ taskName, payload, handlerFound: !!handler });

  return handler?.(payload);
}

void bootstrap();
