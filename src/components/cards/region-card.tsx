// src/components/cards/region-card.tsx
'use client';

import { ArrowUpRight, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { REGIONS, type RegionId } from '@/config/site.config';
import { Card } from './card';
import { CardShell } from './card-shell';
import { CARD_HOVER_CHROME } from './motion';

type Props = {
  id: RegionId;
  index: number;
  total: number;
};

/**
 * Image-led region card.
 *
 * Hover orchestration is layered into three independent paint operations,
 * none of which touch the image's transform — that combination caused the
 * compositor glitch we just isolated. Each layer animates a different CSS
 * property on a different element:
 *
 *   1. Image  → `filter: brightness/saturate` boost. Pure paint, lives in
 *               the image's own compositor layer. The photograph "wakes
 *               up" without ever resizing.
 *   2. Bottom gradient overlay → `opacity` fade. The cream wash recedes
 *               so the photograph reads brighter and the name overlay
 *               feels less buried.
 *   3. Name overlay container → 4px translateY drift on the *text wrapper*.
 *               The image is its sibling, not its child, so the wrapper's
 *               transform stays in its own context. Zero contact with the
 *               image element.
 *
 * The chrome lift (10px from `CardShell`) is the fourth layer, animating
 * the chrome wrapper itself. Four parallel motions, four different
 * elements, four different properties. They never collide.
 */
export function RegionCard({ id, index, total }: Props) {
  const t = useTranslations('regions');
  const meta = REGIONS[id];
  const number = String(index).padStart(2, '0');
  const totalLabel = String(total).padStart(2, '0');

  return (
    <CardShell>
      <Card padding="none" className={cn('h-full', CARD_HOVER_CHROME)}>
        {/* Image area — name overlaid bottom-left, index top-left, indicator top-right */}
        <div className="relative aspect-4/3 w-full overflow-hidden">
          <Image
            src={meta.image.src}
            alt={meta.image.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            quality={80}
            className="object-cover filter-[brightness(0.92)_saturate(0.8)] transition-[filter] duration-700 ease-out-expo group-hover:filter-[brightness(1.06)_saturate(1.15)]"
          />

          {/* Bottom gradient — guarantees name legibility on any photo. Recedes
              on hover so the photograph reads brighter underneath. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-background/90 via-background/30 to-transparent transition-opacity duration-700 ease-out-expo group-hover:opacity-75"
          />

          {/* Index */}
          <span className="absolute top-5 left-5 font-mono text-[11px] tracking-[0.22em] text-foreground/70">
            {number}
            <span className="text-foreground/35"> / {totalLabel}</span>
          </span>

          {/* Active-inventory indicator */}
          <span className="absolute top-5 right-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/55 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-md">
            <span aria-hidden className="size-1.5 rounded-full bg-success animate-pulse" />
            {t('indicator')}
          </span>

          {/* Region name — overlaid for editorial weight. Subtle 4px slide-up
              on hover; the wrapper's transform is its own context, the sibling
              Image element is untouched. */}
          <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between gap-4 transition-transform duration-700 ease-out-expo group-hover:-translate-y-1">
            <h3 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground md:text-[1.625rem]">
              <MapPin aria-hidden className="size-4 text-accent" strokeWidth={1.6} />
              {t(`items.${id}.name`)}
            </h3>
            <ArrowUpRight
              aria-hidden
              className="size-5 -translate-x-2 translate-y-2 text-accent opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
            />
          </div>
        </div>

        {/* Body — chips + tagline */}
        <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
          <ul className="flex flex-wrap gap-1.5">
            {meta.specialties.map(spec => (
              <li
                key={spec}
                className="rounded-full border border-border/70 bg-muted/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground"
              >
                {t(`propertyTypes.${spec}`)}
              </li>
            ))}
          </ul>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground md:text-[0.95rem]">{t(`items.${id}.tagline`)}</p>
        </div>
      </Card>
    </CardShell>
  );
}
