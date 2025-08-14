import { Controller, HttpMethod, Route } from '@fy-tools/rpc-server';
import { z } from 'zod/mini';

export const Schema = new Controller('file')
  .route(
    new Route('init_upload', HttpMethod.POST)
      .body(
        z.object({
          name: z.string(),
          mimetype: z.string(),
          transcode: z.boolean(),
          size: z.number(),
          access: z.enum(['public', 'private', 'public']),
          multipart: z.boolean('boolean'),
        })
      )
      .response(
        z.union([
          z.object({
            type: z.literal('multipart'),
            key: z.string(),
            uploadId: z.string(),
            chunkSize: z.number(),
            url: z.string().check(z.url()),
            uploadUrls: z.array(z.string()),
          }),
          z.object({
            type: z.literal('single'),
            key: z.string(),
            url: z.string().check(z.url()),
            uploadUrl: z.string(),
          }),
        ])
      )
  )
  .route(
    new Route('complete_upload', HttpMethod.PATCH)
      .body(
        z.object({
          key: z.string(),
          uploadId: z.string(),
          parts: z.array(
            z.object({ ETag: z.string(), PartNumber: z.number() })
          ),
        })
      )
      .response(z.object({ success: z.boolean() }))
  )
  .route(
    new Route('get_url', HttpMethod.GET)
      .query(z.object({ key: z.string() }))
      .response(z.object({ url: z.string().check(z.url()) }))
  );
