// src/lib/env.public.ts
import * as z from 'zod';

/**
 * Public environment validation (NEXT_PUBLIC_* variables).
 * Safe to import from both Server and Client Components — Next.js inlines
 * NEXT_PUBLIC_* values into the client bundle at build time.
 *
 * Keep this file free of `'server-only'` and of any server-only imports.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000')
});

const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
});

if (!parsed.success && typeof window === 'undefined') {
  console.warn('[env:public] Invalid public environment variables:', z.treeifyError(parsed.error));
}

export type PublicEnv = z.infer<typeof publicEnvSchema>;

export const publicEnv: PublicEnv = parsed.success ? parsed.data : { NEXT_PUBLIC_SITE_URL: 'http://localhost:3000' };
