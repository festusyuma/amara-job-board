import { Body, Params } from '@fy-tools/rpc-server';

import {
  chatController,
  fetchChat,
  fetchMessages,
  sendMessage,
} from '../schema/schema';

@chatController.Controller
export class ChatController {
  @sendMessage.Handler
  sendMessage(@sendMessage.Body() body: Body<sendMessage>) {
    return {};
  }

  @fetchMessages.Handler
  getMessages() {
    return {};
  }

  @fetchChat.Handler
  getMessage(@fetchChat.Param('id') id: Params<fetchChat>['id']) {
    return {};
  }
}
