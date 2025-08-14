import * as path from 'node:path';

import { UploadPartCommandOutput } from '@aws-sdk/client-s3';
import { Body } from '@fy-tools/rpc-server';
import { HttpException, Inject, Injectable } from '@nestjs/common';

import { ExtensionToMimeType, MimeTypeToExtension } from '../constants';
import { type FileModuleProps, MODULE_OPTIONS_TOKEN } from '../file.definition';
import type { completeUploadRoute, initUploadRoute } from '../file.schema';
import { FileStatus } from '../types';
import { DynamoService } from './dynamo.service';
import { S3Service } from './s3.service';

@Injectable()
export class FileService {
  constructor(
    private s3: S3Service,
    private db: DynamoService,
    @Inject(MODULE_OPTIONS_TOKEN) private config: FileModuleProps
  ) {}

  async serverUpload(
    file: Buffer,
    payload: Omit<Body<initUploadRoute>, 'size' | 'mimetype'>
  ) {
    const fileGroup = payload.name.split('.');
    const fileName = fileGroup.slice(0, fileGroup.length - 1).join('.');
    const extension = fileGroup.at(-1) ?? '';
    const mimetype =
      ExtensionToMimeType[extension] ?? 'application/octet-stream';

    const { key, chunkSize, uploadId } = await this.initMultipartUpload({
      name: fileName,
      mimetype,
      size: file.length,
      access: payload.access,
      transcode: payload.transcode,
    });

    const chunksPromise: Promise<UploadPartCommandOutput>[] = [];
    let totalChunks = 1;

    for (let i = 0; i < file.length; i += chunkSize) {
      chunksPromise.push(
        this.s3.uploadPart(
          key,
          totalChunks++,
          uploadId,
          file.subarray(i, Math.min(file.length, i + chunkSize))
        )
      );
    }

    const chunks = await Promise.all(chunksPromise);

    await this.completeClientUpload({
      key,
      uploadId,
      parts: chunks.map((c, i) => ({ PartNumber: i + 1, ETag: c.ETag ?? '' })),
    });

    return { url: await this.getFileUrl(key) };
  }

  async initClientSingleUpload(payload: Body<initUploadRoute>) {
    const key = this.getKey(payload.name, payload.mimetype, payload.access);
    const fileUrl = await this.getFileUrl(key);
    const uploadUrl = await this.s3.getSignedUploadUrl(key);

    return {
      type: 'single',
      key,
      url: fileUrl,
      uploadUrl,
    };
  }

  async initClientUpload(payload: Body<initUploadRoute>) {
    const { key, chunkSize, uploadId } = await this.initMultipartUpload(
      payload
    );

    const fileUrl = await this.getFileUrl(key);
    const chunks = Math.ceil(payload.size / chunkSize);
    const uploadUrls: Promise<string>[] = [];

    for (let PartNumber = 1; PartNumber <= chunks; PartNumber++) {
      uploadUrls.push(
        this.s3.getSignedUploadPartUrl(key, PartNumber, uploadId)
      );
    }

    return {
      type: 'multipart',
      key,
      chunkSize,
      uploadId,
      url: fileUrl,
      uploadUrls: await Promise.all(uploadUrls),
    };
  }

  async completeClientUpload(payload: Body<completeUploadRoute>) {
    if (this.config.tableName) {
      const res = await this.db.findItem(payload.key);

      if (!res.Item?.uploadId || res.Item.uploadId !== payload.uploadId) {
        throw new HttpException({ message: 'invalid file key' }, 400);
      }
    }

    await this.s3.completeMultipartUpload(
      payload.key,
      payload.uploadId,
      payload.parts
    );

    if (this.config.tableName) {
      await this.db.updateItem({
        key: payload.key,
        status: FileStatus.UPLOADED,
      });
    }

    return true;
  }

  async getFileUrl(key: string) {
    return this.s3.getSignedUrl(key);
  }

  private async initMultipartUpload(
    payload: Omit<Body<initUploadRoute>, 'multipart'>
  ) {
    const key = this.getKey(payload.name, payload.mimetype, payload.access);
    const multipartUpload = await this.s3.createMultipartUpload(key);
    const chunkSize = 5 * 1024 * 1024; // 5MB per chunk

    if (!multipartUpload.UploadId) {
      throw new HttpException({ message: 'unable to initialize upload' }, 500);
    }

    if (this.config.tableName) {
      await this.db.createItem({
        key,
        mimeType: payload.mimetype,
        size: payload.size,
        transcode: payload.transcode,
        uploadId: multipartUpload.UploadId,
      });
    }

    return {
      key,
      chunkSize,
      uploadId: multipartUpload.UploadId,
      url: path.join(this.config.storageDomain, key),
    };
  }

  private getKey(name: string, mimetype: string, access: string) {
    const fileParams = MimeTypeToExtension[mimetype];

    return path.join(
      access,
      fileParams?.type ?? 'document',
      `${Date.now()}-${name}${fileParams?.extension ?? ''}`
    );
  }
}
