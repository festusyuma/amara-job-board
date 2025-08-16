import { getTransporter } from '@amara/helpers/microservice';
import { Logger } from '@nestjs/common';

import { MessageModule } from './messages/message.module';

async function bootstrap() {
  const transporter = await getTransporter(MessageModule);

  const taskName = process.env.TASK_NAME;
  if (!taskName) throw new Error('task name is required');

  const payload = JSON.parse(process.env.PAYLOAD ?? '{}');
  const handler = transporter.getHandlerByPattern(taskName);

  Logger.log({ taskName, payload, handlerFound: !!handler });

  return handler?.(payload);
}

void bootstrap();
