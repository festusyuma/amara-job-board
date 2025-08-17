import { EnvService } from '@amara/helpers/util';
import { ChatMessage } from '@amara/types';
import { ScanCommandOutput } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';

import { DynamoService } from '../dynamo.service';

@Injectable()
export class ChatMessageTable {
  private readonly tableName: string;

  constructor(private env: EnvService, private db: DynamoService) {
    this.tableName = this.env.get('CHAT_MESSAGE_TABLE');
  }

  async create(payload: ChatMessage) {
    return this.db.put({
      Item: payload,
      TableName: this.tableName,
    });
  }

  async findAllByChat(chatId: string): Promise<ChatMessage[]> {
    let startKey: Record<string, unknown> | undefined = undefined;
    let items: ChatMessage[] = [];

    do {
      const res: ScanCommandOutput = await this.db.query({
        TableName: this.tableName,
        IndexName: 'by_chat',
        KeyConditionExpression: '#pk = :pk',
        ExpressionAttributeNames: { '#pk': 'chatId' },
        ExpressionAttributeValues: { ':pk': chatId },
        ExclusiveStartKey: startKey,
      });

      items = items.concat(res.Items as ChatMessage[]);
      startKey = res.LastEvaluatedKey;
    } while (startKey);

    return items;
  }
}
