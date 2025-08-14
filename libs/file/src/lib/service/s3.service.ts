import * as fs from 'node:fs';
import * as path from 'node:path';

import {
  type CompletedPart,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl as cdnSignedUrl } from '@aws-sdk/cloudfront-signer';
import {
  getSignedUrl,
  getSignedUrl as s3SignedUrl,
} from '@aws-sdk/s3-request-presigner';
import { HttpException, Inject, Injectable } from '@nestjs/common';

import { MODULE_OPTIONS_TOKEN } from '../file.definition';
import type { S3Options } from '../types';

@Injectable()
export class S3Service extends S3Client {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private options: S3Options) {
    super();
  }

  createMultipartUpload(key: string) {
    return this.send(
      new CreateMultipartUploadCommand({
        Bucket: this.options.bucketName,
        Key: key,
      })
    );
  }

  completeMultipartUpload(
    key: string,
    uploadId?: string,
    parts?: CompletedPart[]
  ) {
    return this.send(
      new CompleteMultipartUploadCommand({
        Bucket: this.options.bucketName,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: { Parts: parts },
      })
    );
  }

  getSignedUploadUrl(key: string) {
    const cmd = new PutObjectCommand({
      Bucket: this.options.bucketName,
      Key: key,
    });

    return getSignedUrl(this, cmd, { expiresIn: 60 * 60 * 24 });
  }

  getSignedUploadPartUrl(
    key: string,
    part: number,
    uploadId: string,
    expires = 3600
  ) {
    return s3SignedUrl(
      this,
      new UploadPartCommand({
        Key: key,
        PartNumber: part,
        Bucket: this.options.bucketName,
        UploadId: uploadId,
      }),
      { expiresIn: expires }
    );
  }

  uploadPart(key: string, part: number, uploadId: string, body: Buffer) {
    return this.send(
      new UploadPartCommand({
        Key: key,
        PartNumber: part,
        Bucket: this.options.bucketName,
        UploadId: uploadId,
        Body: body,
      })
    );
  }

  /**
   * @param {string} key
   * @param {number} expiresIn - in seconds.
   * */
  getSignedUrl(key: string, expiresIn = 3600) {
    if (!this.options.cdnLink) {
      return s3SignedUrl(
        this,
        new GetObjectCommand({
          Bucket: this.options.bucketName,
          Key: key,
        }),
        { expiresIn }
      );
    }

    if (!this.options.keyPair || !this.options.privateKey) {
      throw new HttpException(
        { message: 'privateKey and keyPair are requrired for this operation' },
        500
      );
    }

    return cdnSignedUrl({
      dateLessThan: new Date(Date.now() + expiresIn * 1000),
      url: path.join(this.options.storageDomain, key),
      keyPairId: this.options.keyPair,
      privateKey: fs.readFileSync(this.options.privateKey).toString(),
    });
  }
}
