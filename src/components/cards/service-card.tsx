// src/components/cards/service-card.tsx
'use client';

import { ArrowUpRight, BadgeCheck, Briefcase, Home, KeyRound, Store, TrendingUp, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';
import type { ServiceId } from '@/config/site.config';
import { Card } from './card';
import { CardShell } from './card-shell';
import { CARD_HOVER_CHROME } from './motion';

type Props = {
  id: ServiceId;
  index: number;
  total: number;
};

/**
 * Icon registry lives inside the client card, not the parent server section.
 * Lucide icons are React component functions, and React Server Components
 * cannot serialise functions across the server → client boundary. Passing
 * `icon` as a prop from the section would crash with "Functions cannot be
 * passed directly to Client Components". Keeping the lookup here keeps the
 * section's prop surface plain (string ID only) and RSC-safe.
 */
const ICONS: Record<ServiceId, LucideIcon> = {
  residential: Home,
  rental: KeyRound,
  investment: TrendingUp,
  commercial: Store,
  valuation: BadgeCheck,
  portfolio: Briefcase
};

/**
 * Editorial services card — text-only, no media.
 *
 * Composition: `CardShell` (two-layer hover + spring lift) wraps a static
 * `Card` chrome. Interior accent flourishes (icon recolour, accent rule
 * grow, corner indicator slide-in) ride on the outer's `group-hover` so
 * they sync with the lift without their own motion engines.
 */
export function ServiceCard({ id, index, total }: Props) {
  const t = useTranslations('services');
  const Icon = ICONS[id];
  const number = String(index).padStart(2, '0');
  const totalLabel = String(total).padStart(2, '0');

  return (
    <CardShell>
      <Card padding="lg" className={cn('h-full', CARD_HOVER_CHROME)}>
        {/* Top row — numero + iconography */}
        <div className="flex items-start justify-between">
          <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
            {number}
            <span className="text-muted-foreground/40"> / {totalLabel}</span>
          </span>

          <span
            aria-hidden
            className="flex size-11 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors duration-500 group-hover:border-accent/60 group-hover:text-accent"
          >
            <Icon className="size-5" strokeWidth={1.6} />
          </span>
        </div>

        {/* Body */}
        <h3 className="mt-10 text-xl font-semibold tracking-tight text-foreground md:text-[1.375rem]">{t(`items.${id}.title`)}</h3>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground md:text-[0.95rem]">{t(`items.${id}.description`)}</p>

        {/* Hover-only accent rule that grows from the left */}
        <span
          aria-hidden
          className="mt-8 block h-px w-10 origin-left scale-x-100 bg-accent/60 transition-transform duration-500 ease-out-expo group-hover:scale-x-[6]"
        />

        {/* Corner indicator on hover */}
        <ArrowUpRight
          aria-hidden
          className="absolute right-5 bottom-5 size-4 -translate-x-2 translate-y-2 text-accent opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
        />
      </Card>
    </CardShell>
  );
}
