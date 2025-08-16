import { EnvService } from '@amara/helpers/util';
import { ParsedJobPost } from '@amara/types';
import { Injectable } from '@nestjs/common';

import { DynamoService } from './dynamo.service';

@Injectable()
export class JobDb {
  private readonly tableName: string;

  constructor(private env: EnvService, private db: DynamoService) {
    this.tableName = this.env.get('STORAGE_NAME');
  }

  async save({ id, name, ...parsedData }: ParsedJobPost) {
    const existing = await this.db.get({
      Key: { id },
      TableName: this.tableName,
    });

    if (existing.Item) {
      await this.db.update({
        Key: { id },
        TableName: this.tableName,
        UpdateExpression:
          'SET updatedAt = :updatedAt, #parsedData = :parsedData',
        ExpressionAttributeValues: {
          ':updatedAt': new Date().toISOString(),
          ':parsedData': parsedData,
        },
        ExpressionAttributeNames: {
          '#parsedData': 'status',
        },
        ReturnValues: 'UPDATED_NEW',
      });
    } else {
      await this.db.put({
        Item: { id, name, parsedData: parsedData },
        TableName: this.tableName,
      });
    }
  }
}
