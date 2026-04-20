// src/components/ui/counter.tsx
'use client';

import { animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { useLocale } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';

type Props = {
  /** Target number to count up to. */
  value: number;
  /** Animation length in seconds. Defaults to a perceptually balanced 2.4s. */
  duration?: number;
  /** Delay (s) before counting starts — used to align with parent stagger sequences. */
  delay?: number;
  /** Viewport threshold (0–1) at which the counter activates. Match parent stagger. */
  amount?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
};

/**
 * Viewport-triggered animated counter.
 *
 * Architecture:
 * - Animation drives a MotionValue (no React state during the count).
 * - Subscribed via useMotionValueEvent → writes textContent directly to DOM.
 * - Bypasses React reconciliation → constant cost regardless of duration.
 * - Locale-aware number formatting via memoized Intl.NumberFormat.
 * - Honors prefers-reduced-motion (snaps instantly).
 * - Accepts an explicit `delay` so parent components can choreograph multiple
 *   counters in sync with Stagger animations.
 */
export function Counter({ value, duration = 2.4, delay = 0, amount = 0.4, className, prefix = '', suffix = '' }: Props) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(containerRef, { once: true, amount });
  const reduce = useReducedMotion();
  const locale = useLocale();
  const motionValue = useMotionValue(0);

  const formatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  useMotionValueEvent(motionValue, 'change', latest => {
    const node = numberRef.current;
    if (node) {
      node.textContent = formatter.format(Math.round(latest));
    }
  });

  // Re-format the static initial "0" if locale changes before animation runs.
  useEffect(() => {
    const node = numberRef.current;
    if (node && motionValue.get() === 0) {
      node.textContent = formatter.format(0);
    }
  }, [formatter, motionValue]);

  useEffect(() => {
    if (!inView) return;

    if (reduce === true) {
      motionValue.set(value);
      return;
    }

    const controls = animate(motionValue, value, {
      duration,
      delay,
      // Quart-out: smoother distribution than expo, the count feels deliberate.
      ease: [0.22, 1, 0.36, 1]
    });

    return () => controls.stop();
  }, [inView, value, duration, delay, reduce, motionValue]);

  return (
    <span ref={containerRef} className={className} aria-label={`${prefix}${value}${suffix}`}>
      {prefix}
      <span ref={numberRef} aria-hidden>
        {formatter.format(0)}
      </span>
      {suffix}
    </span>
  );
}
