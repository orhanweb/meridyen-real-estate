// src/components/cards/card.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * Generic card chrome — purely visual surface.
 *
 * Border, background, padding, radius, and an optional resting shadow.
 * No animation, no hover, no interactivity. The deliberate minimalism
 * lets each section compose this surface inside its own motion shell
 * (`ServiceCard`, `RegionCard`, `TestimonialCard`) instead of forcing
 * one spring policy on every content type. Server-component friendly:
 * no client boundary is created here.
 */
const cardChromeVariants = cva('relative flex flex-col overflow-hidden rounded-lg border border-border text-surface-foreground', {
  variants: {
    /** Surface tone — default cream/dark surface, muted nest, or transparent. */
    tone: {
      surface: 'bg-surface',
      muted: 'bg-muted',
      transparent: 'bg-transparent'
    },
    /** Resting elevation. `flat` gives the card a hairline shadow so any
     *  parent-driven lift has a baseline to rise from. */
    elevation: {
      none: '',
      flat: 'shadow-[0_1px_3px_-1px_oklch(from_var(--color-foreground)_l_c_h/0.06)]'
    },
    /** Inner padding scale. */
    padding: {
      none: 'p-0',
      sm: 'p-5',
      md: 'p-7',
      lg: 'p-9'
    }
  },
  defaultVariants: {
    tone: 'surface',
    elevation: 'flat',
    padding: 'md'
  }
});

export type CardProps = ComponentProps<'div'> & VariantProps<typeof cardChromeVariants>;

/** Static card surface. Compose inside a motion shell to make it interactive. */
export function Card({ className, tone, elevation, padding, ...props }: CardProps) {
  return <div data-slot="card" className={cn(cardChromeVariants({ tone, elevation, padding }), className)} {...props} />;
}

export { cardChromeVariants };
