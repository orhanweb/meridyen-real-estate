// src/lib/env.ts
import 'server-only';
import * as z from 'zod';

/**
 * Server-only environment validation.
 * Never import this file from a Client Component.
 *
 * All keys are optional so the app stays bootable in local dev without
 * external accounts; downstream modules degrade gracefully (the contact
 * action returns `generic` if Resend is not configured, the rate limiter
 * falls back to an in-memory bucket if Upstash is not configured).
 */
const serverEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_TO_EMAIL: z.email().optional(),
  CONTACT_FROM_EMAIL: z.string().min(1).optional(),
  UPSTASH_REDIS_REST_URL: z.url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional()
});

const parsed = serverEnvSchema.safeParse({
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN
});

if (!parsed.success) {
  console.warn('[env] Invalid environment variables:', z.treeifyError(parsed.error));
}

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export const env: ServerEnv = parsed.success ? parsed.data : ({} as ServerEnv);
