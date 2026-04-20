// src/components/ui/accordion.tsx
'use client';

import { ChevronDown } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type AccordionItem = {
  /** Stable identifier — used as React key and ARIA id seed. */
  id: string;
  question: string;
  answer: ReactNode;
};

type Props = {
  items: AccordionItem[];
  className?: string;
  /** "single" closes the previously open row when another opens. Default: single. */
  type?: 'single' | 'multiple';
  /** Per-item entry stagger delay (s). */
  stagger?: number;
};

/**
 * Editorial accordion primitive — accessible, animated, no external dep.
 *
 * Architecture & a11y:
 * - W3C APG accordion pattern: <h3><button aria-expanded aria-controls></h3>
 *   followed by a panel with role="region" aria-labelledby.
 * - Native <button> handles Enter/Space; chevron rotates on open.
 * - Panels are ALWAYS rendered (height-clipped when closed) so the answer copy
 *   ships in SSR HTML — critical for SEO crawlers and for assistive tech that
 *   follows aria-expanded but still expects the panel to exist in DOM.
 * - One useInView observer gates entry stagger (no per-row observers).
 * - prefers-reduced-motion: snaps height/opacity instantly, no transition.
 */
export function Accordion({ items, className, type = 'single', stagger = 0.07 }: Props) {
  const [openIds, setOpenIds] = useState<readonly string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.1 });
  const reduce = useReducedMotion() === true;

  const toggle = (id: string) => {
    setOpenIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      return type === 'single' ? [id] : [...prev, id];
    });
  };

  return (
    <div ref={containerRef} className={cn('flex flex-col divide-y divide-border', className)}>
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: i * stagger, ease: [0.16, 1, 0.3, 1] }}
        >
          <Row item={item} isOpen={openIds.includes(item.id)} onToggle={() => toggle(item.id)} reduce={reduce} />
        </motion.div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

type RowProps = {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  reduce: boolean;
};

function Row({ item, isOpen, onToggle, reduce }: RowProps) {
  const baseId = useId();
  const panelId = `${baseId}-panel`;
  const triggerId = `${baseId}-trigger`;

  return (
    <div>
      <h3>
        <button
          id={triggerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className={cn(
            'flex w-full items-center justify-between gap-6 py-6 text-left text-base font-medium tracking-tight md:py-7 md:text-lg',
            'transition-colors duration-300 ease-out-expo',
            isOpen ? 'text-foreground' : 'text-foreground/90 hover:text-foreground'
          )}
        >
          <span className="flex-1 text-pretty">{item.question}</span>
          <ChevronDown
            aria-hidden
            className={cn(
              'size-5 shrink-0 transition-[transform,color] duration-500 ease-out-expo',
              isOpen ? 'rotate-180 text-accent' : 'text-muted-foreground'
            )}
            strokeWidth={1.6}
          />
        </button>
      </h3>

      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div
          aria-hidden={!isOpen}
          className="max-w-3xl pb-6 text-pretty text-sm leading-relaxed text-muted-foreground md:pb-8 md:text-base md:leading-[1.7]"
        >
          {item.answer}
        </div>
      </motion.div>
    </div>
  );
}
