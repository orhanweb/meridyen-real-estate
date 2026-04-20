// src/components/ui/brand-mark.tsx
'use client';

import type { MouseEvent } from 'react';
import { siteConfig } from '@/config/site.config';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { BrandEmblem } from './brand-emblem';

type Props = {
  className?: string;
  href?: string;
  /** `'full'` renders emblem + wordmark, `'mark'` renders the emblem only. */
  variant?: 'full' | 'mark';
};

/**
 * Primary brand lockup: compass-rose emblem + letterspaced wordmark.
 *
 * The emblem is 28px / `size-7` by default — it dominates the wordmark on
 * purpose so the symbol does the brand-asserting work. Override via the
 * `className` prop (e.g. `size-6` for tighter contexts) when needed.
 *
 * Click behaviour:
 * - On a different route (e.g. legal pages): normal locale-aware navigation.
 * - On the same route (the landing page itself): smooth scroll to top
 *   instead of a no-op navigation, honouring prefers-reduced-motion.
 */
export function BrandMark({ className, href = '/', variant = 'full' }: Props) {
  const label = siteConfig.brand.name;
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== href) return;
    event.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-label={label}
      className={cn('group inline-flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-90', className)}
    >
      <BrandEmblem aria-hidden className="size-7 shrink-0" />
      {variant === 'full' ? (
        <span className="text-sm font-semibold uppercase leading-none tracking-[0.22em]">{siteConfig.brand.shortName}</span>
      ) : null}
    </Link>
  );
}
