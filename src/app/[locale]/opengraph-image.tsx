// src/app/[locale]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BrandEmblem } from '@/components/ui/brand-emblem';
import { siteConfig } from '@/config/site.config';
import { routing, type Locale } from '@/i18n/routing';

export const alt = `${siteConfig.brand.name} · ${siteConfig.location.city}, ${siteConfig.location.country}`;
export const size = { width: 1200, height: 630 } as const;
export const contentType = 'image/png';

const FONTS_DIR = join(process.cwd(), 'node_modules', 'geist', 'dist', 'fonts', 'geist-sans');

async function loadFonts() {
  const [regular, bold] = await Promise.all([readFile(join(FONTS_DIR, 'Geist-Regular.ttf')), readFile(join(FONTS_DIR, 'Geist-Bold.ttf'))]);
  return [
    { name: 'Geist', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'Geist', data: bold, weight: 700 as const, style: 'normal' as const }
  ];
}

const palette = {
  bgStart: '#fafaf7',
  bgEnd: '#f0eadc',
  navy: '#0e1422',
  navyDeep: '#080d18',
  gold: '#c8a35c',
  muted: '#6f6855',
  watermark: 'rgba(14, 20, 34, 0.06)',
  pillBg: 'rgba(14, 20, 34, 0.05)',
  goldRing: 'rgba(200, 163, 92, 0.22)'
} as const;

const eyebrowByLocale: Record<Locale, string> = {
  tr: 'KÖKLÜ GAYRİMENKUL DANIŞMANLIĞI',
  en: 'ESTABLISHED PROPERTY ADVISORY'
};

interface OgImageProps {
  params: Promise<{ locale: string }>;
}

export default async function OpenGraphImage({ params }: OgImageProps) {
  const { locale: raw } = await params;
  const locale: Locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;

  const [t, fonts] = await Promise.all([getTranslations({ locale, namespace: 'seo' }), loadFonts()]);

  const ogTitle = t('ogTitle');
  const eyebrow = `${eyebrowByLocale[locale]} · ${siteConfig.brand.foundedYear}`;
  const cityLabel = `${siteConfig.location.city.toLocaleUpperCase('tr')} · ${siteConfig.location.country.toLocaleUpperCase('tr')}`;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '72px 80px',
        background: `linear-gradient(135deg, ${palette.bgStart} 0%, ${palette.bgEnd} 100%)`,
        fontFamily: 'Geist',
        color: palette.navy,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: -180,
          bottom: -180,
          width: 880,
          height: 880,
          color: palette.watermark,
          display: 'flex'
        }}
      >
        <BrandEmblem width={880} height={880} />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          position: 'relative'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 84,
            height: 84,
            borderRadius: 22,
            background: palette.navy,
            color: palette.bgStart,
            boxShadow: `0 0 0 8px ${palette.goldRing}`
          }}
        >
          <BrandEmblem width={56} height={56} />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 26px',
            borderRadius: 999,
            background: palette.pillBg,
            color: palette.navy,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: 4
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: palette.gold
            }}
          />
          <div style={{ display: 'flex' }}>{cityLabel}</div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: 940,
          position: 'relative'
        }}
      >
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: -3,
            color: palette.navyDeep,
            display: 'flex'
          }}
        >
          {ogTitle}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          position: 'relative'
        }}
      >
        <div
          style={{
            width: 72,
            height: 4,
            borderRadius: 2,
            background: palette.gold
          }}
        />
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: 5,
            color: palette.muted,
            display: 'flex'
          }}
        >
          {eyebrow}
        </div>
      </div>
    </div>,
    { ...size, fonts }
  );
}
