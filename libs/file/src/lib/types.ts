export const FileStatus = {
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  DELETED: 'deleted',
  REMOVED: 'removed',
};

export type FileStatus = (typeof FileStatus)[keyof typeof FileStatus];

export const FileType = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  DOCUMENT: 'document',
};

export type FileType = (typeof FileType)[keyof typeof FileType];

export const FileAccess = {
  PUBLIC: 'public',
  PROTECTED: 'protected',
  PRIVATE: 'private',
};

export type FileAccess = (typeof FileAccess)[keyof typeof FileAccess];

export const FileMimeType = {
  [FileType.IMAGE]: 'image/*',
  [FileType.VIDEO]: 'video/*',
  [FileType.AUDIO]: 'audio/*',
} as const;

export type FileMimeType = (typeof FileMimeType)[keyof typeof FileMimeType];

export type S3Options = {
  bucketName: string;
  storageDomain: string;
  prefix?: string;
  /**
   * S3 bucket is served behind Cloudfront Distribution
   * */
  cdnLink?: boolean;
  /**
   * Cloudfront Distribution Private key ID
   * */
  keyPair?: string;
  /**
   * Location of private key file
   * */
  privateKey?: string;
};

export type DBOptions = {
  tableName: string;
};

export type InitFileUpload = {
  name: string;
  mimeType: FileMimeType;
  size: number;
  key: string;
  access: FileAccess;
  transcode: boolean;
};

export interface InitMultiPartUpload {
  key: string;
  type: FileType;
  mimeType: string;
  size: number;
  transcode?: boolean;
  status?: FileStatus;
  uploadId: string;
}

export type InitFileUploadResponse = {
  url: string;
  key: string;
  uploadUrls: string[];
  chunkSize: number;
};

export type CompleteFileUpload = {
  key: string;
  parts: { ETag: string; PartNumber: number }[];
};
