// src/components/cards/testimonial-card.tsx
'use client';

import { Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';
import type { TestimonialId } from '@/config/site.config';
import { Card } from './card';
import { CardShell } from './card-shell';
import { CARD_HOVER_CHROME } from './motion';

/**
 * Single quote card — figure / blockquote / figcaption pattern (W3C
 * recommended). Composition mirrors `ServiceCard`: `CardShell` provides
 * the spring lift + hover-detector boundary, the static `Card` carries
 * the chrome and the CSS hover utilities for the quote glyph.
 */
export function TestimonialCard({ id }: { id: TestimonialId }) {
  const t = useTranslations(`testimonials.items.${id}`);
  const name = t('name');
  const initial = name.charAt(0);

  return (
    <CardShell>
      <Card padding="lg" className={cn('h-full', CARD_HOVER_CHROME)}>
        <figure className="flex h-full flex-col gap-8">
          {/* Decorative quote glyph — whispers, doesn't shout */}
          <Quote aria-hidden className="size-7 text-accent/60 transition-colors duration-500 group-hover:text-accent" strokeWidth={1.6} />

          {/* Pull-quote — magazine scale, foreground weight */}
          <blockquote className="flex-1">
            <p className="text-pretty text-lg font-medium leading-relaxed text-foreground md:text-xl md:leading-[1.55]">{t('quote')}</p>
          </blockquote>

          {/* Author — initial badge + meta, separated by a hairline */}
          <figcaption className="mt-2 flex items-center gap-4 border-t border-border pt-6">
            <span
              aria-hidden
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-transparent font-mono text-sm font-medium text-foreground"
            >
              {initial}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">{name}</span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {t('role')} · {t('location')}
              </span>
            </span>
          </figcaption>
        </figure>
      </Card>
    </CardShell>
  );
}
