import { ChatMessageTable, ChatTable } from '@amara/db';
import { SnsService } from '@amara/helpers/util';
import { MessagePayload, MessageType } from '@amara/types';
import { Body } from '@fy-tools/rpc-server';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { sendMessage } from '../schema/schema';

@Injectable()
export class ChatService {
  constructor(
    private event: SnsService,
    private chatTable: ChatTable,
    private chatMessageTable: ChatMessageTable
  ) {}

  async sendMessage(payload: Body<sendMessage>) {
    let chatId = payload.id;

    if (!chatId) {
      const chat = {
        id: v4(),
        title: payload.message.slice(0, 50),
        createdAt: new Date().toISOString(),
      };

      await this.chatTable.create(chat);
      chatId = chat.id;
    }

    const chatMessage: MessagePayload<typeof MessageType.NEW_CHAT_MESSAGE> = {
      id: v4(),
      files: [],
      message: payload.message,
      chatId: chatId,
      createdAt: new Date().toISOString(),
    };

    await this.chatMessageTable.create(chatMessage);

    await this.event.sendEvent({
      message: MessageType.NEW_CHAT_MESSAGE,
      payload: chatMessage,
    });
  }

  async fetchChats() {
    const chats = await this.chatTable.findAll();
    return { data: chats };
  }

  async fetchMessages(id: string) {
    const messages = await this.chatMessageTable.findAllByChat(id);
    return { data: messages };
  }
}
