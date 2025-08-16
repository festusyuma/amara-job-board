import { getTransporter } from '@amara/helpers/microservice';
import { sqsHandler } from '@amara/helpers/microservice/handlers/sqs';

import { MessageModule } from './app/message.module';

const app = getTransporter(MessageModule);

export const handler = sqsHandler(app);
