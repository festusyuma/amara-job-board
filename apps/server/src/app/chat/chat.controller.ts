import { Body, Params } from '@fy-tools/rpc-server';

import {
  chatController,
  fetchChat,
  fetchMessages,
  sendMessage,
} from '../schema/schema';
import { ChatService } from './chat.service';

@chatController.Controller
export class ChatController {
  constructor(private service: ChatService) {}

  @sendMessage.Handler
  async sendMessage(@sendMessage.Body() body: Body<sendMessage>) {
    await this.service.sendMessage(body);
    return;
  }

  @fetchMessages.Handler
  async getMessages() {
    return { data: await this.service.fetchChats() };
  }

  @fetchChat.Handler
  getMessage(@fetchChat.Param('id') id: Params<fetchChat>['id']) {
    return { data: [] };
  }
}
