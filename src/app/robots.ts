// src/app/robots.ts
import type { MetadataRoute } from 'next';
import { getBaseUrl, isIndexableEnvironment } from '@/lib/seo';

/**
 * Dynamic robots.txt. Production allows full crawl and advertises the
 * sitemap + canonical host; everywhere else (preview, local) blocks all
 * user agents so staging URLs never leak into search indexes.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  if (!isIndexableEnvironment()) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }]
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
