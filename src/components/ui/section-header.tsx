// src/components/ui/section-header.tsx
import type { ElementType } from 'react';
import { FadeIn } from '@/components/motion/fade-in';
import { RevealText } from '@/components/motion/reveal-text';
import { cn } from '@/lib/cn';

type Align = 'left' | 'center';

type Props = {
  /** Small uppercase label above the heading. */
  eyebrow?: string;
  /** Main heading copy. Animated via mask-reveal. */
  title: string;
  /** Optional supporting paragraph below the heading. */
  lead?: string;
  /** Heading element (h2 by default). */
  as?: Extract<ElementType, 'h1' | 'h2' | 'h3'>;
  align?: Align;
  className?: string;
  headingClassName?: string;
  leadClassName?: string;
};

/**
 * Editorial section header used by all major page sections.
 * Composes eyebrow rule + reveal-mask heading + supporting lead.
 */
export function SectionHeader({ eyebrow, title, lead, as = 'h2', align = 'left', className, headingClassName, leadClassName }: Props) {
  const isCenter = align === 'center';

  return (
    <header className={cn('flex flex-col', isCenter ? 'items-center text-center' : 'items-start text-left', className)}>
      {eyebrow ? (
        <FadeIn delay={0.05} duration={0.6} amount={0.4}>
          <div className={cn('mb-6 inline-flex items-center gap-3', isCenter && 'justify-center')}>
            <span aria-hidden className="h-px w-10 bg-accent" />
            <span className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">{eyebrow}</span>
          </div>
        </FadeIn>
      ) : null}

      <RevealText
        as={as}
        delay={0.1}
        className={cn(
          'block max-w-3xl text-balance font-semibold leading-[1.08] tracking-tight text-foreground',
          'text-[clamp(1.875rem,4.2vw,3.5rem)]',
          isCenter && 'mx-auto',
          headingClassName
        )}
      >
        {title}
      </RevealText>

      {lead ? (
        <FadeIn delay={0.45} duration={0.7} amount={0.4}>
          <p
            className={cn(
              'mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg',
              isCenter && 'mx-auto',
              leadClassName
            )}
          >
            {lead}
          </p>
        </FadeIn>
      ) : null}
    </header>
  );
}
