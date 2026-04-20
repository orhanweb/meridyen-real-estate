// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

/**
 * Centralized i18n routing config.
 * Add a new locale here + create messages/{locale}.json — that is all.
 */
export const routing = defineRouting({
  locales: ['tr', 'en'] as const,
  defaultLocale: 'tr',
  localePrefix: 'as-needed',
  localeDetection: true
});

export type Locale = (typeof routing.locales)[number];
