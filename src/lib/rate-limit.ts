// src/lib/rate-limit.ts
import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';
import { env } from '@/lib/env';

/**
 * Sliding-window rate limiter with two backends:
 *   - Upstash Redis when both UPSTASH_* env vars are set (production).
 *   - In-memory fallback for local dev so the form still works without keys.
 *
 * The in-memory bucket is intentionally per-process and per-instance —
 * never use it as a real defense in production: ship Upstash there.
 *
 * Limit: 5 contact submissions / 10 minutes / IP. Generous for humans,
 * tight enough to make automated abuse uneconomic alongside the honeypot
 * and the time-trap on the Zod schema.
 */

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  /** Epoch ms when the bucket resets / a new request would succeed. */
  reset: number;
};

const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
const WINDOW_LABEL = '10 m' as const;

type UpstashClient = { limit: (id: string) => Promise<RateLimitResult> };

let upstash: UpstashClient | null = null;
function getUpstash(): UpstashClient | null {
  if (upstash) return upstash;
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return null;

  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN
  });

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(LIMIT, WINDOW_LABEL),
    analytics: true,
    prefix: 'meridyen:contact'
  });

  upstash = {
    limit: async (id: string) => {
      const r = await limiter.limit(id);
      return { success: r.success, limit: r.limit, remaining: r.remaining, reset: r.reset };
    }
  };
  return upstash;
}

/** In-memory sliding-window bucket — dev-only fallback. */
const memoryBuckets = new Map<string, number[]>();
function memoryLimit(id: string): RateLimitResult {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const stamps = (memoryBuckets.get(id) ?? []).filter(t => t > cutoff);

  if (stamps.length >= LIMIT) {
    const oldest = stamps[0] ?? now;
    memoryBuckets.set(id, stamps);
    return { success: false, limit: LIMIT, remaining: 0, reset: oldest + WINDOW_MS };
  }

  stamps.push(now);
  memoryBuckets.set(id, stamps);
  return { success: true, limit: LIMIT, remaining: LIMIT - stamps.length, reset: now + WINDOW_MS };
}

/**
 * Resolves the best-effort client IP from common proxy headers.
 * Falls back to a stable token so local dev without proxies still rate-limits.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  if (fwd) {
    const first = fwd.split(',')[0]?.trim();
    if (first) return first;
  }
  return h.get('x-real-ip') ?? h.get('cf-connecting-ip') ?? 'unknown';
}

export async function limitContact(identifier: string): Promise<RateLimitResult> {
  const client = getUpstash();
  if (client) return client.limit(identifier);
  return memoryLimit(identifier);
}
