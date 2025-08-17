import { SnsService } from '@amara/helpers/util';
import { MessagePayload, MessageType } from '@amara/types';
import { Body } from '@fy-tools/rpc-server';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { sendMessage } from '../schema/schema';

@Injectable()
export class ChatService {
  constructor(private event: SnsService) {}

  async sendMessage(payload: Body<sendMessage>) {
    let chatId = payload.id;

    if (!chatId) {
      // todo create new chat
      chatId = v4();
    }

    const chatMessage: MessagePayload<typeof MessageType.NEW_CHAT_MESSAGE> = {
      files: [],
      message: payload.message,
      id: v4(),
      chatId: chatId,
      createdAt: new Date().toISOString(),
    };

    // todo create message

    await this.event.sendEvent({
      message: MessageType.NEW_CHAT_MESSAGE,
      payload: chatMessage,
    });
  }

  async fetchChats() {
    // todo fetch chats from database
    return [];
  }

  async fetchMessages(id: string) {
    // todo fetch messages from database
    return [];
  }
}
