import { EnvService } from '@amara/helpers/util';
import { Chat } from '@amara/types';
import { ScanCommandOutput } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';

import { DynamoService } from '../dynamo.service';

@Injectable()
export class ChatTable {
  private readonly tableName: string;

  constructor(private env: EnvService, private db: DynamoService) {
    this.tableName = this.env.get('CHAT_TABLE');
  }

  async find(id: string): Promise<Chat> {
    const res = await this.db.get({
      Key: { id },
      TableName: this.tableName,
    });

    return res.Item as Chat;
  }

  async create(payload: Chat) {
    return this.db.put({
      Item: payload,
      TableName: this.tableName,
    });
  }

  async findAll(): Promise<Chat[]> {
    let startKey: Record<string, unknown> | undefined = undefined;
    let items: Chat[] = [];

    do {
      const res: ScanCommandOutput = await this.db.scan({
        TableName: this.tableName,
        ExclusiveStartKey: startKey,
      });

      items = items.concat(res.Items as Chat[]);
      startKey = res.LastEvaluatedKey;
    } while (startKey);

    return items;
  }
}
