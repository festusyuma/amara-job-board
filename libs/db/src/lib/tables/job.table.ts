import { EnvService } from '@amara/helpers/util';
import { JobPost, ParsedJobPost } from '@amara/types';
import { ScanCommandOutput } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';

import { DynamoService } from '../dynamo.service';

@Injectable()
export class JobTable {
  private readonly tableName: string;

  constructor(private env: EnvService, private db: DynamoService) {
    this.tableName = this.env.get('JOB_TABLE');
  }

  async findById(id: string): Promise<JobPost | undefined> {
    const res = await this.db.get({
      Key: { id },
      TableName: this.tableName,
    });

    return res.Item as JobPost;
  }

  async save({
    id,
    name,
    description,
    ...parsedData
  }: JobPost | ParsedJobPost) {
    const existing = await this.db.get({
      Key: { id },
      TableName: this.tableName,
    });

    if (existing.Item) {
      return this.db.update({
        Key: { id },
        TableName: this.tableName,
        UpdateExpression:
          'SET updatedAt = :updatedAt, #parsedData = :parsedData',
        ExpressionAttributeValues: {
          ':updatedAt': new Date().toISOString(),
          ':parsedData': parsedData,
        },
        ExpressionAttributeNames: {
          '#parsedData': 'parsedData',
        },
        ReturnValues: 'UPDATED_NEW',
      });
    } else {
      return this.db.put({
        Item: { id, name, description, parsedData: parsedData },
        TableName: this.tableName,
      });
    }
  }

  async findAll(): Promise<ParsedJobPost[]> {
    let startKey: Record<string, unknown> | undefined = undefined;
    let items: ParsedJobPost[] = [];

    do {
      const res: ScanCommandOutput = await this.db.scan({
        TableName: this.tableName,
        ExclusiveStartKey: startKey,
      });

      items = items.concat(res.Items as ParsedJobPost[]);
      startKey = res.LastEvaluatedKey;
    } while (startKey);

    return items;
  }
}
