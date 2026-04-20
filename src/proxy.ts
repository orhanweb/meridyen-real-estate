// src/proxy.ts
import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

/**
 * 128-bit base64 nonce per request. Web Crypto API is available in the
 * Edge runtime that powers Next.js middleware / proxy.
 */
function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

/**
 * Builds the per-request Content-Security-Policy.
 *
 * Why no `strict-dynamic`: `@vercel/analytics` still has no nonce prop
 * (vercel/analytics#122 — open since 2023). `strict-dynamic` would invalidate
 * the host whitelist and block Vercel's analytics + speed-insights scripts.
 * Instead we keep the explicit `va.vercel-scripts.com` allowance and rely on
 * per-request nonces for our own inline scripts. `unsafe-inline` is removed
 * either way, so injected XSS payloads must know the nonce to execute.
 *
 * `unsafe-eval` is gated to dev only — React uses `eval` to reconstruct
 * server-side stack traces during development; production builds never do.
 */
function buildCsp(nonce: string, isDev: boolean): string {
  const scriptSrc = ["'self'", `'nonce-${nonce}'`, 'https://va.vercel-scripts.com', isDev ? "'unsafe-eval'" : ''].filter(Boolean).join(' ');

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com",
    "font-src 'self' data:",
    "connect-src 'self' https://vitals.vercel-insights.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'"
  ].join('; ');
}

/**
 * Next.js 16 Proxy (formerly Middleware). Chains:
 *   1. Per-request CSP nonce, surfaced via `x-nonce` request header so RSC
 *      layouts can read it through `headers()` and stamp their inline scripts.
 *   2. Strict CSP applied to the outbound response.
 *   3. next-intl locale negotiation, redirects, and rewrites.
 */
export default function proxy(request: NextRequest) {
  const nonce = generateNonce();
  const isDev = process.env.NODE_ENV === 'development';
  const csp = buildCsp(nonce, isDev);

  request.headers.set('x-nonce', nonce);

  const response = intlMiddleware(request);

  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  /**
   * Match every pathname except:
   *  - API routes (`/api`, `/trpc`)
   *  - Next + Vercel internals (`/_next`, `/_vercel`)
   *  - Root metadata routes (`/icon`, `/apple-icon`) generated from
   *    `app/icon.tsx` and `app/apple-icon.tsx` — these are not locale-aware.
   *  - Static asset paths containing a dot (e.g. `/manifest.webmanifest`,
   *    `/sitemap.xml`, `/robots.txt`, `/favicon.ico`).
   */
  matcher: '/((?!api|trpc|_next|_vercel|icon|apple-icon|.*\\..*).*)'
};
