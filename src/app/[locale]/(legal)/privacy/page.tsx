// src/app/[locale]/(legal)/privacy/page.tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LegalArticle } from '@/components/legal/legal-article';
import { routing } from '@/i18n/routing';
import {
  getAlternateLanguagesForPath,
  getAlternateOgLocales,
  getCanonicalUrlForPath,
  getLocalizedPath,
  getOgLocale,
  isIndexableEnvironment
} from '@/lib/seo';

type RouteParams = { locale: string };

const PATH = '/privacy';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: 'legal.privacy' });
  const canonical = getLocalizedPath(locale, PATH);
  const canonicalUrl = getCanonicalUrlForPath(locale, PATH);
  const allowIndex = isIndexableEnvironment();

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical,
      languages: getAlternateLanguagesForPath(PATH)
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: t('metadataTitle'),
      description: t('metadataDescription'),
      locale: getOgLocale(locale),
      alternateLocale: [...getAlternateOgLocales(locale)]
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metadataTitle'),
      description: t('metadataDescription')
    },
    robots: allowIndex ? { index: true, follow: true } : { index: false, follow: false }
  };
}

export default async function PrivacyPage({ params }: { params: Promise<RouteParams> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return <LegalArticle slug="privacy" />;
}
