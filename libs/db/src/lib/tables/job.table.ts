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

  async create(data: JobPost) {
    return this.db.put({
      Item: { ...data, parsedDate: {} },
      TableName: this.tableName,
    });
  }

  async updateParsedData({ id, ...parsedData }: ParsedJobPost) {
    const existing = await this.db.get({
      Key: { id },
      TableName: this.tableName,
    });

    if (!existing.Item) return;

    return this.db.update({
      Key: { id },
      TableName: this.tableName,
      UpdateExpression: 'SET updatedAt = :updatedAt, #parsedData = :parsedData',
      ExpressionAttributeValues: {
        ':updatedAt': new Date().toISOString(),
        ':parsedData': parsedData,
      },
      ExpressionAttributeNames: {
        '#parsedData': 'parsedData',
      },
      ReturnValues: 'UPDATED_NEW',
    });
  }

  async findAll(): Promise<JobPost[]> {
    let startKey: Record<string, unknown> | undefined = undefined;
    let items: JobPost[] = [];

    do {
      const res: ScanCommandOutput = await this.db.scan({
        TableName: this.tableName,
        ExclusiveStartKey: startKey,
      });

      items = items.concat(res.Items as JobPost[]);
      startKey = res.LastEvaluatedKey;
    } while (startKey);

    return items;
  }
}
