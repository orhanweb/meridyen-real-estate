// src/components/seo/structured-data.tsx
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site.config';
import type { Locale } from '@/i18n/routing';
import { buildLandingGraph, serializeJsonLd } from '@/lib/structured-data';

interface Props {
  readonly locale: Locale;
}

/**
 * Renders the homepage JSON-LD graph (RealEstateAgent + WebSite + WebPage +
 * FAQPage) as a single `<script type="application/ld+json">`. Async server
 * component — translations resolved on the server, no client cost.
 */
export async function StructuredData({ locale }: Props) {
  const [tMeta, tSeo, tFaq] = await Promise.all([
    getTranslations({ locale, namespace: 'metadata' }),
    getTranslations({ locale, namespace: 'seo' }),
    getTranslations({ locale, namespace: 'faq' })
  ]);

  const faqItems = siteConfig.faq.map(id => ({
    question: tFaq(`items.${id}.question`),
    answer: tFaq(`items.${id}.answer`)
  }));

  const graph = buildLandingGraph({
    locale,
    page: {
      title: tMeta('title'),
      description: tMeta('description')
    },
    org: {
      description: tSeo('ogDescription')
    },
    faq: faqItems
  });

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(graph) }} />;
}
