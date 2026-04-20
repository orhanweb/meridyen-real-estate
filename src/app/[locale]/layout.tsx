// src/app/[locale]/layout.tsx
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Toaster } from 'sonner';
import { HtmlLangSync } from '@/components/providers/html-lang-sync';
import { siteConfig } from '@/config/site.config';
import { routing } from '@/i18n/routing';
import { getAlternateLanguages, getAlternateOgLocales, getCanonicalPath, getCanonicalUrl, getOgLocale, isIndexableEnvironment } from '@/lib/seo';

type RouteParams = { locale: string };

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const [tMeta, tSeo] = await Promise.all([getTranslations({ locale, namespace: 'metadata' }), getTranslations({ locale, namespace: 'seo' })]);

  const canonical = getCanonicalPath(locale);
  const canonicalUrl = getCanonicalUrl(locale);
  const languages = getAlternateLanguages();
  const ogTitle = tSeo('ogTitle');
  const ogDescription = tSeo('ogDescription');
  const allowIndex = isIndexableEnvironment();
  const twitterHandle = siteConfig.seo.twitterHandle;

  return {
    metadataBase: new URL(siteConfig.seo.siteUrl),
    title: {
      default: tMeta('title'),
      template: `%s · ${siteConfig.brand.shortName}`
    },
    description: tMeta('description'),
    keywords: tMeta('keywords')
      .split(',')
      .map(k => k.trim())
      .filter(Boolean),
    applicationName: siteConfig.brand.name,
    authors: [{ name: siteConfig.brand.legalEntity }],
    creator: siteConfig.brand.legalEntity,
    publisher: siteConfig.brand.legalEntity,
    formatDetection: {
      email: false,
      address: false,
      telephone: false
    },
    alternates: {
      canonical,
      languages
    },
    openGraph: {
      type: 'website',
      locale: getOgLocale(locale),
      alternateLocale: [...getAlternateOgLocales(locale)],
      url: canonicalUrl,
      siteName: siteConfig.brand.name,
      title: ogTitle,
      description: ogDescription
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      ...(twitterHandle ? { site: twitterHandle, creator: twitterHandle } : {})
    },
    robots: allowIndex
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1
          }
        }
      : {
          index: false,
          follow: false,
          nocache: true,
          googleBot: { index: false, follow: false, noimageindex: true }
        },
    other: {
      // Surfaced by some Apple devices when added to the home screen.
      'apple-mobile-web-app-title': siteConfig.brand.shortName
    }
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf7' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1422' }
  ],
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark'
};

/**
 * Locale-scoped layout. The HTML shell, theme system, fonts and analytics
 * live in the root layout (`src/app/layout.tsx`); this layer only carries
 * the i18n provider, the runtime `<html lang>` patch and the toast portal.
 */
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<RouteParams> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <HtmlLangSync locale={locale} />
      <div className="relative flex min-h-dvh flex-col">{children}</div>
      <Toaster position="bottom-right" richColors closeButton theme="system" />
    </NextIntlClientProvider>
  );
}
