// src/components/motion/parallax.tsx
'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  children: ReactNode;
  className?: string;
  /** Pixel distance to translate from offset start to end. */
  offset?: number;
  /** Optional scale at scroll end (1 = no scale). */
  scale?: number;
};

/**
 * Scroll-driven Y translate (and optional scale) bound to the element's own
 * viewport offsets. Suitable for hero backgrounds, decorative imagery.
 */
export function Parallax({ children, className, offset = 120, scale = 1.08 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, offset]);
  const s = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, scale]);

  return (
    <div ref={ref} className={cn('relative size-full', className)}>
      <motion.div style={{ y, scale: s }} className="relative size-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
