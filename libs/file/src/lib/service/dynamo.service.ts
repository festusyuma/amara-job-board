import { DynamoDBClient, ReturnValue } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable } from '@nestjs/common';

import { MODULE_OPTIONS_TOKEN } from '../file.definition';
import { type DBOptions, FileStatus } from '../types';

@Injectable()
export class DynamoService extends DynamoDBDocument {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private options: DBOptions) {
    super(new DynamoDBClient());
  }

  createItem(payload: {
    key: string;
    mimeType: string;
    size: number;
    transcode: boolean;
    uploadId: string;
  }) {
    return this.put({
      TableName: this.options.tableName,
      Item: {
        key: payload.key,
        mimeType: payload.mimeType,
        size: payload.size.toString(),
        transcode: payload.transcode,
        status: FileStatus.UPLOADING,
        uploadId: payload.uploadId,
      },
    });
  }

  findItem(key: string) {
    return this.get({
      TableName: this.options.tableName,
      Key: { key },
    });
  }

  updateItem(payload: { key: string; status: FileStatus }) {
    return this.update({
      TableName: this.options.tableName,
      Key: { key: payload.key },
      UpdateExpression: 'SET updatedAt = :updatedAt, #file_status = :status',
      ExpressionAttributeValues: {
        ':updatedAt': new Date().toISOString(),
        ':status': payload.status,
      },
      ExpressionAttributeNames: {
        '#file_status': 'status',
      },
      ReturnValues: ReturnValue.UPDATED_NEW,
    });
  }
}
