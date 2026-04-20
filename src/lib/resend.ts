// src/lib/resend.ts
import 'server-only';
import { Resend } from 'resend';
import { siteConfig } from '@/config/site.config';
import { env } from '@/lib/env';

/**
 * Lazy-initialized Resend client. Returns null when RESEND_API_KEY is absent
 * so the contact action can fail closed with a generic error in local dev
 * without crashing the app.
 */
let cached: Resend | null = null;
export function getResend(): Resend | null {
  if (!env.RESEND_API_KEY) return null;
  if (!cached) cached = new Resend(env.RESEND_API_KEY);
  return cached;
}

/**
 * Resend test sender — only delivers to the Resend account owner's address,
 * which makes it the safest default while a custom domain isn't verified yet.
 */
const RESEND_DEFAULT_FROM = 'Meridyen Demo <onboarding@resend.dev>';

export function resolveFromAddress(): string {
  return env.CONTACT_FROM_EMAIL ?? RESEND_DEFAULT_FROM;
}

export function resolveToAddress(): string {
  return env.CONTACT_TO_EMAIL ?? siteConfig.contact.email;
}
