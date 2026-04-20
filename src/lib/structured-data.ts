// src/lib/structured-data.ts
import { siteConfig } from '@/config/site.config';
import { routing, type Locale } from '@/i18n/routing';
import { getCanonicalUrl } from '@/lib/seo';

/**
 * Schema.org JSON-LD builders for the landing page. Pure functions, no I/O —
 * fed by `siteConfig` and locale-resolved copy from the caller. Output is
 * shaped as a single `@graph` so all entities are linked via `@id`
 * references and search engines parse one script tag instead of many.
 */

type SchemaNode = Record<string, unknown>;

interface PageMeta {
  readonly title: string;
  readonly description: string;
}

interface OrgMeta {
  /** Substantive description of the agency, typically the locale's ogDescription. */
  readonly description: string;
}

interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

interface LandingGraphInput {
  readonly locale: Locale;
  readonly page: PageMeta;
  readonly org: OrgMeta;
  readonly faq: readonly FaqItem[];
}

/** BCP-47 language tags for schema.org `inLanguage`. */
const SCHEMA_LANGUAGES = {
  tr: 'tr-TR',
  en: 'en-US'
} as const satisfies Record<Locale, string>;

const ISO_WEEKDAYS = {
  weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  saturday: ['Saturday'],
  sunday: ['Sunday']
} as const;

function getInLanguage(locale: Locale): string {
  return SCHEMA_LANGUAGES[locale];
}

/**
 * Stable per-entity URI fragments. Organisation, website, webpage and FAQ are
 * anchored to the homepage canonical because they describe the same logical
 * entities across locales. The primary image is locale-aware — each locale has
 * its own OG render — so its `@id` is anchored to the localized URL.
 */
function buildIds(homeUrl: string, localizedUrl: string) {
  return {
    organization: `${homeUrl}#organization`,
    website: `${homeUrl}#website`,
    webpage: `${homeUrl}#webpage`,
    faq: `${homeUrl}#faq`,
    primaryImage: `${localizedUrl}#primaryimage`
  } as const;
}

/** OpenGraph image dimensions emitted by `[locale]/opengraph-image.tsx`. */
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

/** Resolves the absolute URL of the per-locale dynamic OpenGraph image. */
function getOgImageUrl(homeUrl: string, locale: Locale): string {
  return `${homeUrl}${locale === routing.defaultLocale ? '' : `/${locale}`}/opengraph-image`;
}

/** Parse "09:00 – 19:00" / "10:00-17:00" into ISO `opens`/`closes` pair. */
function parseHourRange(range: string | null): { opens: string; closes: string } | null {
  if (!range) return null;
  const match = range.match(/(\d{2}:\d{2})\s*[–-]\s*(\d{2}:\d{2})/);
  if (!match) return null;
  return { opens: match[1]!, closes: match[2]! };
}

function buildOpeningHours(): SchemaNode[] {
  const out: SchemaNode[] = [];
  const weekdays = parseHourRange(siteConfig.contact.hours.weekdays);
  if (weekdays) {
    out.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ISO_WEEKDAYS.weekdays,
      opens: weekdays.opens,
      closes: weekdays.closes
    });
  }
  const saturday = parseHourRange(siteConfig.contact.hours.saturday);
  if (saturday) {
    out.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ISO_WEEKDAYS.saturday,
      opens: saturday.opens,
      closes: saturday.closes
    });
  }
  return out;
}

function buildOrganization(homeUrl: string, ids: ReturnType<typeof buildIds>, locale: Locale, org: OrgMeta): SchemaNode {
  const localizedName = locale === 'tr' ? siteConfig.brand.name : siteConfig.brand.nameEn;
  const altName = locale === 'tr' ? siteConfig.brand.nameEn : siteConfig.brand.name;
  const slogan = locale === 'tr' ? siteConfig.brand.tagline : siteConfig.brand.taglineEn;
  return {
    '@type': 'RealEstateAgent',
    '@id': ids.organization,
    name: localizedName,
    alternateName: altName,
    legalName: siteConfig.brand.legalEntity,
    slogan,
    description: org.description,
    url: homeUrl,
    image: { '@id': ids.primaryImage },
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    foundingDate: String(siteConfig.brand.foundedYear),
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.location.addressLine,
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.city,
      addressCountry: siteConfig.location.countryCode
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.location.coordinates.lat,
      longitude: siteConfig.location.coordinates.lng
    },
    areaServed: {
      '@type': 'City',
      name: siteConfig.location.city
    },
    openingHoursSpecification: buildOpeningHours(),
    sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin, siteConfig.social.youtube]
  };
}

function buildWebSite(homeUrl: string, ids: ReturnType<typeof buildIds>, locale: Locale): SchemaNode {
  const localizedName = locale === 'tr' ? siteConfig.brand.name : siteConfig.brand.nameEn;
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: homeUrl,
    name: localizedName,
    publisher: { '@id': ids.organization },
    inLanguage: getInLanguage(locale)
  };
}

function buildWebPage(localizedUrl: string, ids: ReturnType<typeof buildIds>, page: PageMeta, locale: Locale): SchemaNode {
  return {
    '@type': 'WebPage',
    '@id': ids.webpage,
    url: localizedUrl,
    name: page.title,
    description: page.description,
    isPartOf: { '@id': ids.website },
    about: { '@id': ids.organization },
    primaryImageOfPage: { '@id': ids.primaryImage },
    inLanguage: getInLanguage(locale)
  };
}

/**
 * Concrete `ImageObject` referenced by both `Organization.image` and
 * `WebPage.primaryImageOfPage`. Without this node those references would
 * dangle and Google would silently drop the image association.
 */
function buildPrimaryImage(homeUrl: string, ids: ReturnType<typeof buildIds>, page: PageMeta, locale: Locale): SchemaNode {
  const url = getOgImageUrl(homeUrl, locale);
  return {
    '@type': 'ImageObject',
    '@id': ids.primaryImage,
    url,
    contentUrl: url,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    caption: page.title,
    inLanguage: getInLanguage(locale)
  };
}

function buildFaqPage(ids: ReturnType<typeof buildIds>, items: readonly FaqItem[]): SchemaNode {
  return {
    '@type': 'FAQPage',
    '@id': ids.faq,
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };
}

/** Build the full landing-page JSON-LD `@graph` for the given locale. */
export function buildLandingGraph({ locale, page, org, faq }: LandingGraphInput): SchemaNode {
  const homeUrl = getCanonicalUrl(routing.defaultLocale);
  const localizedUrl = getCanonicalUrl(locale);
  const ids = buildIds(homeUrl, localizedUrl);

  const graph: SchemaNode[] = [
    buildPrimaryImage(homeUrl, ids, page, locale),
    buildOrganization(homeUrl, ids, locale, org),
    buildWebSite(homeUrl, ids, locale),
    buildWebPage(localizedUrl, ids, page, locale)
  ];

  if (faq.length > 0) {
    graph.push(buildFaqPage(ids, faq));
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}

/**
 * Serialize a JSON-LD graph for embedding in `<script>` content.
 * Escapes `<` to `\u003c` so a stray `</script>` inside any string can't
 * close our script tag — defence-in-depth even though our copy is curated.
 */
export function serializeJsonLd(graph: SchemaNode): string {
  return JSON.stringify(graph).replace(/</g, '\\u003c');
}
