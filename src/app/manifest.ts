// src/app/manifest.ts
import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site.config';

/**
 * PWA web app manifest. Surfaced when users 'Add to Home Screen' (iOS) or
 * install the site as a PWA (Android / Chrome). Icons are auto-discovered
 * by Next from `app/icon.tsx` and `app/apple-icon.tsx`; we still list the
 * primary icon explicitly so older clients that ignore that convention
 * still get a usable launcher icon.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.brand.name,
    short_name: siteConfig.brand.shortName,
    description: siteConfig.brand.tagline,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#fafaf7',
    theme_color: '#0e1422',
    categories: ['business', 'lifestyle', 'productivity'],
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      }
    ]
  };
}
