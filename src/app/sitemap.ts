// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getAlternateLanguages, getAlternateLanguagesForPath, getCanonicalUrl, getCanonicalUrlForPath } from '@/lib/seo';

/**
 * Routes to surface in the sitemap. Each entry is rendered once per locale
 * and ships the full hreflang graph (including x-default).
 */
const ROUTES = [
  { path: '/', priority: 1, changeFrequency: 'monthly' as const },
  { path: '/privacy', priority: 0.4, changeFrequency: 'yearly' as const },
  { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const }
] as const;

/**
 * Sitemap with one entry per (locale, route) pair. Each entry declares the
 * full hreflang set so search engines see a fully-connected language graph
 * and surface the correct variant per user.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.flatMap(route =>
    routing.locales.map(locale => ({
      url: route.path === '/' ? getCanonicalUrl(locale) : getCanonicalUrlForPath(locale, route.path),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: locale === routing.defaultLocale ? route.priority : Math.round(Math.max(0.1, route.priority - 0.1) * 10) / 10,
      alternates: {
        languages: route.path === '/' ? getAlternateLanguages() : getAlternateLanguagesForPath(route.path)
      }
    }))
  );
}
