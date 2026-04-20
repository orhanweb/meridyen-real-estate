// src/config/site.config.ts
import { publicEnv } from '@/lib/env.public';

/**
 * Single source of truth for brand, contact, content catalog and metadata.
 * White-label hand-off: change values here + replace assets to rebrand the site.
 *
 * Translatable strings (titles, descriptions, narrative copy) live in
 * src/i18n/messages/{locale}.json and are looked up by stable IDs declared here.
 */

/** Stable IDs for the services catalog. Keep in sync with i18n keys. */
export const SERVICE_IDS = ['residential', 'rental', 'investment', 'commercial', 'valuation', 'portfolio'] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];

/** Lucide icon names per service — resolved in the Service card component. */
export const SERVICE_ICONS = {
  residential: 'Home',
  rental: 'KeyRound',
  investment: 'TrendingUp',
  commercial: 'Store',
  valuation: 'BadgeCheck',
  portfolio: 'Briefcase'
} as const satisfies Record<ServiceId, string>;

/** Property type chips used by region cards. Keep in sync with i18n keys. */
export const PROPERTY_TYPES = ['villa', 'apartment', 'land', 'commercial', 'office'] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

/** Stable IDs for the regions catalog. Keep in sync with i18n keys. */
export const REGION_IDS = ['cankaya', 'cayyolu', 'bilkent', 'oran', 'beysukent', 'kecioren'] as const;
export type RegionId = (typeof REGION_IDS)[number];

/** Stable IDs for the testimonials catalog. Keep in sync with i18n keys. */
export const TESTIMONIAL_IDS = ['esra', 'kaan', 'meltem', 'serdar'] as const;
export type TestimonialId = (typeof TESTIMONIAL_IDS)[number];

/** Stable IDs for the FAQ catalog. Keep in sync with i18n keys. */
export const FAQ_IDS = ['commission', 'duration', 'whyMeridyen', 'kvkk', 'valuation', 'remote'] as const;
export type FaqId = (typeof FAQ_IDS)[number];

/**
 * Service options exposed to the contact form's "interest" select.
 * Mirrors SERVICE_IDS plus an "other" escape hatch — kept separate so the
 * marketing service catalog and the form contract can evolve independently.
 */
export const CONTACT_INTEREST_IDS = [...SERVICE_IDS, 'other'] as const;
export type ContactInterestId = (typeof CONTACT_INTEREST_IDS)[number];

/**
 * Region options exposed to the contact form's "preferred region" select.
 * Mirrors REGION_IDS plus "other" for outside-coverage requests.
 */
export const CONTACT_REGION_IDS = [...REGION_IDS, 'other'] as const;
export type ContactRegionId = (typeof CONTACT_REGION_IDS)[number];

/**
 * Per-region asset + property mix manifest. Translatable copy (name, tagline)
 * lives in i18n; this manifest controls visuals, ordering and chip selection.
 */
type RegionEntry = {
  image: { src: string; alt: string };
  specialties: readonly PropertyType[];
};

export const REGIONS: Record<RegionId, RegionEntry> = {
  cankaya: {
    image: {
      src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
      alt: 'Modern glass tower at dusk — Çankaya district feel'
    },
    specialties: ['apartment', 'office', 'commercial']
  },
  cayyolu: {
    image: {
      src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80',
      alt: 'Contemporary residential villa with landscaped garden'
    },
    specialties: ['villa', 'apartment', 'land']
  },
  bilkent: {
    image: {
      src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80',
      alt: 'Tree-lined modern campus and residential blocks'
    },
    specialties: ['apartment', 'office']
  },
  oran: {
    image: {
      src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
      alt: 'Luxury detached residence at golden hour'
    },
    specialties: ['villa', 'land']
  },
  beysukent: {
    image: {
      src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      alt: 'Modern residential complex facade'
    },
    specialties: ['villa', 'apartment', 'land']
  },
  kecioren: {
    image: {
      src: 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1600&q=80',
      alt: 'Aerial view of mid-rise residential neighbourhood'
    },
    specialties: ['apartment', 'commercial']
  }
} as const satisfies Record<RegionId, RegionEntry>;

export const siteConfig = {
  brand: {
    name: 'Meridyen Gayrimenkul',
    nameEn: 'Meridyen Real Estate',
    shortName: 'Meridyen',
    tagline: 'Doğru gayrimenkul, doğru zamanda.',
    taglineEn: 'The right property, at the right moment.',
    foundedYear: 2008,
    legalEntity: 'Meridyen Gayrimenkul Danışmanlık A.Ş.'
  },

  location: {
    city: 'Ankara',
    country: 'Türkiye',
    countryCode: 'TR',
    addressLine: 'Çankaya, Ankara',
    googleMapsUrl: 'https://maps.google.com/?q=Çankaya+Ankara',
    coordinates: { lat: 39.9208, lng: 32.8541 }
  },

  contact: {
    phone: '+90 312 000 00 00',
    phoneFormatted: '+90 (312) 000 00 00',
    whatsapp: '+905000000000',
    whatsappFormatted: '+90 500 000 00 00',
    /** Public-facing email — also the inbox for inbound contact submissions. */
    email: 'orhan.stack@gmail.com',
    /** Open hours used by the contact section info column. */
    hours: {
      weekdays: '09:00 – 19:00',
      saturday: '10:00 – 17:00',
      sunday: null
    },
    /** Promised first-response window for inbound leads, in hours. */
    responseHours: 2
  },

  social: {
    instagram: 'https://instagram.com/meridyengayrimenkul',
    linkedin: 'https://linkedin.com/company/meridyengayrimenkul',
    youtube: 'https://youtube.com/@meridyengayrimenkul'
  },

  /**
   * Studio credit shown in the footer. Designed as a white-label hand-off
   * point — set `enabled: false` to hide on a per-client deployment.
   */
  designer: {
    enabled: true,
    name: 'Orhan Kahraman',
    url: 'https://www.linkedin.com/in/orhan-kahraman/'
  },

  /** Legal placeholders surfaced in the footer; replace with real numbers per client. */
  legal: {
    mersis: '0000-0000-0000-0000',
    taxOffice: 'Çankaya V.D.',
    taxNumber: '0000000000'
  },

  /** Hard numbers used across the site (hero stats, about section). */
  stats: {
    yearsOfExperience: 17,
    propertiesSold: 480,
    happyClientsPercent: 98,
    activeListings: 65
  },

  /** Anchor IDs for in-page navigation. Keep in sync with section components. */
  sections: {
    about: 'about',
    services: 'services',
    regions: 'regions',
    testimonials: 'testimonials',
    faq: 'faq',
    contact: 'contact'
  },

  /** Service catalog — translatable copy lives in i18n. */
  services: SERVICE_IDS,

  /** Regions catalog — order here drives render order. */
  regions: REGION_IDS,

  /** Testimonials catalog — order here drives render order. */
  testimonials: TESTIMONIAL_IDS,

  /** FAQ catalog — order here drives render order. */
  faq: FAQ_IDS,

  /** Editorial / hero imagery. Replace with client photography for production. */
  assets: {
    hero: {
      src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80',
      alt: 'Modern luxury residence at golden hour',
      credit: 'Unsplash'
    },
    about: {
      src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
      alt: 'Editorial architectural interior',
      credit: 'Unsplash'
    }
  },

  seo: {
    /** Origin used for canonical URLs, hreflang, OG and sitemap. */
    siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
    /**
     * Twitter @handle for the brand (with leading `@`). When `null`, the
     * `twitter:site` and `twitter:creator` tags are omitted instead of
     * shipping a placeholder that points at a non-existent account.
     */
    twitterHandle: null as string | null
  }
} as const;

export type SiteConfig = typeof siteConfig;
