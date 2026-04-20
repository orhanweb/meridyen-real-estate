// src/lib/seo.ts
import { siteConfig } from '@/config/site.config';
import { routing, type Locale } from '@/i18n/routing';

/**
 * Map between app locales and OpenGraph BCP 47-style locale codes.
 * Extend here when adding new languages.
 */
const OG_LOCALES = {
  tr: 'tr_TR',
  en: 'en_US'
} as const satisfies Record<Locale, string>;

/** Configured base URL with any trailing slash stripped, computed once. */
const baseUrl = siteConfig.seo.siteUrl.replace(/\/$/, '');

/**
 * Canonical pathname for the given locale, respecting `localePrefix: 'as-needed'`.
 * Default locale lives at `/`; all others are prefixed (e.g. `/en`).
 */
export function getCanonicalPath(locale: Locale): string {
  return locale === routing.defaultLocale ? '/' : `/${locale}`;
}

/** Absolute canonical URL for the given locale. */
export function getCanonicalUrl(locale: Locale): string {
  const path = getCanonicalPath(locale);
  return path === '/' ? baseUrl : `${baseUrl}${path}`;
}

/**
 * hreflang language → absolute URL map for `<link rel="alternate">`.
 * Includes an `x-default` entry pointing at the default-locale canonical so
 * search engines have a fallback when no language matches the user.
 */
export function getAlternateLanguages(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const locale of routing.locales) {
    map[locale] = getCanonicalUrl(locale);
  }
  map['x-default'] = getCanonicalUrl(routing.defaultLocale);
  return map;
}

/** OpenGraph locale code (e.g. `tr_TR`) for the active app locale. */
export function getOgLocale(locale: Locale): string {
  return OG_LOCALES[locale];
}

/** OpenGraph locale codes for every locale other than the active one. */
export function getAlternateOgLocales(activeLocale: Locale): readonly string[] {
  return routing.locales.filter((l): l is Locale => l !== activeLocale).map(l => OG_LOCALES[l]);
}

/**
 * Whether the current deployment should be indexed by search engines.
 * Honours `VERCEL_ENV` first (so previews and dev never get indexed),
 * then falls back to `NODE_ENV`.
 */
export function isIndexableEnvironment(): boolean {
  const env = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
  return env === 'production';
}

/** Absolute base URL with any trailing slash stripped. */
export function getBaseUrl(): string {
  return baseUrl;
}

/**
 * Locale-prefixed pathname for an arbitrary route (e.g. `/privacy`).
 * Default locale stays prefix-less; others get `/{locale}` prepended.
 */
export function getLocalizedPath(locale: Locale, pathname: string): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return locale === routing.defaultLocale ? normalized : `/${locale}${normalized}`;
}

/** Absolute canonical URL for an arbitrary path under the given locale. */
export function getCanonicalUrlForPath(locale: Locale, pathname: string): string {
  return `${baseUrl}${getLocalizedPath(locale, pathname)}`;
}

/** hreflang language → absolute URL map for an arbitrary path. */
export function getAlternateLanguagesForPath(pathname: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const locale of routing.locales) {
    map[locale] = getCanonicalUrlForPath(locale, pathname);
  }
  map['x-default'] = getCanonicalUrlForPath(routing.defaultLocale, pathname);
  return map;
}
