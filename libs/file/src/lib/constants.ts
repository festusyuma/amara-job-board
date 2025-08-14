import { FileType } from './types';

export const ExtensionToMimeType: Record<string, string> = {
  txt: 'text/plain',
  html: 'text/html',
  htm: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  json: 'application/json',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  pdf: 'application/pdf',
  zip: 'application/zip',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
  '': 'application/octet-stream',
};

export const MimeTypeToExtension: Record<
  string,
  { extension: string; type: FileType }
> = {
  'text/plain': {
    extension: '.txt',
    type: 'document',
  },
  'text/html': {
    extension: '.html',
    type: 'document',
  },
  'text/css': {
    extension: '.css',
    type: 'document',
  },
  'text/javascript': {
    extension: '.js',
    type: 'document',
  },
  'application/json': {
    extension: '.json',
    type: 'document',
  },
  'image/jpeg': {
    extension: '.jpeg',
    type: 'image',
  },
  'image/png': {
    extension: '.png',
    type: 'image',
  },
  'image/gif': {
    extension: '.gif',
    type: 'image',
  },
  'audio/mpeg': {
    extension: '.mp3',
    type: 'audio',
  },
  'video/mp4': {
    extension: '.mp4',
    type: 'video',
  },
  'application/pdf': {
    extension: '.pdf',
    type: 'document',
  },
  'application/zip': {
    extension: '.zip',
    type: 'document',
  },
  'application/msword': {
    extension: '.doc',
    type: 'document',
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    extension: '.docx',
    type: 'document',
  },
  'application/vnd.ms-excel': {
    extension: '.xls',
    type: 'document',
  },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    extension: '.xlsx',
    type: 'document',
  },
  'text/csv': {
    extension: '.csv',
    type: 'document',
  },
  'application/octet-stream': {
    extension: '',
    type: 'document',
  },
};
