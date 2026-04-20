// src/components/motion/reveal-text.tsx
'use client';

import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef, type ElementType } from 'react';

type Props = {
  children: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  by?: 'word' | 'char';
  once?: boolean;
  /** Fraction of the wrapping element that must be visible to trigger. */
  amount?: number;
};

/**
 * Editorial mask-reveal headline.
 *
 * Architecture:
 * - One useInView observer on a single wrapper drives ALL token reveals.
 *   Sharing one observer is significantly cheaper than per-token whileInView.
 * - All motion.spans share that single inView state — deterministic.
 * - Each token slides up from a clipping mask with a cascading delay.
 * - Honors prefers-reduced-motion (renders text statically).
 */
export function RevealText({ children, as, className, delay = 0, duration = 0.8, stagger = 0.06, by = 'word', once = true, amount = 0.15 }: Props) {
  const Tag = (as ?? 'span') as ElementType;
  const probeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(probeRef, { once, amount });
  const reduce = useReducedMotion();
  const tokens = by === 'word' ? children.split(/(\s+)/) : Array.from(children);

  if (reduce) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag className={className}>
      {/* Inline observer host — does not alter inline flow but provides a
          stable bounding rect for IntersectionObserver. */}
      <span ref={probeRef}>
        {tokens.map((token, i) => {
          if (/^\s+$/.test(token)) {
            return <span key={i}>{token}</span>;
          }
          return (
            <span key={i} className="inline-block overflow-hidden align-bottom leading-[1.05]">
              <motion.span
                className="inline-block will-change-transform"
                initial={{ y: '110%' }}
                animate={inView ? { y: '0%' } : { y: '110%' }}
                transition={{
                  duration,
                  delay: delay + i * stagger,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                {token}
              </motion.span>
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
