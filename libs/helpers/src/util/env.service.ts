import { Env, ParsedEnv } from '@amara/env';
import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod/mini';

export const EnvSchema = z.object({
  REGION: z.string(),
  ENVIRONMENT: z.string(),
  DATABASE_URL: z.string(),
  // AUTH_CLIENT_ID: z.string(),
  // AUTH_ID: z.string(),
  // AUTH_CLIENT_SECRET: z.string(),
  // CACHE_TABLE_NAME: z.string(),
  // CACHE_DEFAULT_TTL: z.optional(z.coerce.number()),
  // REDEEMED_VOUCHER_TABLE: z.string(),
  // VOUCHER_TABLE: z.string(),
  // CDN_DOMAIN: z.string(),
  STORAGE_NAME: z.string(),
  STORAGE_DOMAIN: z.string(),
  // STORAGE_CDN_LINK: z.optional(z.string()),
  // STORAGE_LOG_TABLE: z.string(),
  EVENT_TOPIC: z.string(),
  GEMINI_KEY: z.string(),
  JOB_TABLE: z.string(),
  CHAT_TABLE: z.string(),
  CHAT_MESSAGE_TABLE: z.string(),
  // REDEMPTION_SYNC_FREQUENCY: z.pipe(
  //   z._default(z.string(), 'month'),
  //   z.transform((i) => i as DateTimeUnit)
  // ),
});

type EnvType = z.infer<typeof EnvSchema>;

@Injectable()
export class EnvService extends Env<EnvType> {
  constructor(@Inject(ParsedEnv) secrets: EnvType) {
    super(secrets);
  }
}
