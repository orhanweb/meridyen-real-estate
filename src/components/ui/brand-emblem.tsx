// src/components/ui/brand-emblem.tsx
import type { SVGProps } from 'react';

/** Brand gold accent — single source of truth for the centre pin. */
const GOLD = '#c8a35c';

/**
 * Meridyen brand emblem — the compass-rose mark.
 *
 * Single SVG primitive shared across every surface that displays the brand:
 * the wordmark lockup (`BrandMark`), favicon (`app/icon.tsx`), Apple touch
 * icon (`app/apple-icon.tsx`) and the social OG image. Foreground inherits via
 * `currentColor` so the same source renders correctly on light and dark
 * backgrounds without duplicate definitions.
 *
 * Design notes
 *  - Outer ring + faint inner ring deliver the "noter mührü" depth without
 *    crowding the symbol.
 *  - Vertical (north-south) axis is rendered at full opacity, the horizontal
 *    axis at 0.55 opacity, biasing the gestalt toward a north-pointing star.
 *  - Four 45° tick marks anchor the rose to the ring at small sizes and read
 *    as ornament at larger sizes.
 *  - Gold centre pin is the only colour that does *not* inherit, ensuring the
 *    brand accent stays consistent across themes.
 */
export function BrandEmblem(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" focusable="false" {...props}>
      {/* Outer ring */}
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth={1} fill="none" opacity={0.45} />
      {/* Inner ring — adds depth without crowding */}
      <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth={0.6} fill="none" opacity={0.18} />

      {/* North-South axis — the visual lead */}
      <path d="M32 4 L34.4 32 L32 60 L29.6 32 Z" fill="currentColor" />
      {/* East-West axis — same shape vocabulary, dialed back */}
      <path d="M4 32 L32 29.6 L60 32 L32 34.4 Z" fill="currentColor" opacity={0.55} />

      {/* 45° tick marks anchor the rose to the ring */}
      <line x1="13" y1="13" x2="17.5" y2="17.5" stroke="currentColor" strokeWidth={1} opacity={0.4} />
      <line x1="51" y1="13" x2="46.5" y2="17.5" stroke="currentColor" strokeWidth={1} opacity={0.4} />
      <line x1="13" y1="51" x2="17.5" y2="46.5" stroke="currentColor" strokeWidth={1} opacity={0.4} />
      <line x1="51" y1="51" x2="46.5" y2="46.5" stroke="currentColor" strokeWidth={1} opacity={0.4} />

      {/* Gold centre pin — the brand accent constant */}
      <circle cx="32" cy="32" r="2.4" fill={GOLD} />
    </svg>
  );
}
