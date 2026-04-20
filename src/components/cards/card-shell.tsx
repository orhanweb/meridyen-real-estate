// src/components/cards/card-shell.tsx
'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/cn';
import { LIFT_SPRING, liftVariants, reducedLiftVariants } from './motion';

/**
 * Two-layer hover shell for interactive cards.
 *
 * Architecture
 *   - Outer layer  → static. Owns the `:hover` detection box and the
 *                    `group` className that downstream CSS hover utilities
 *                    hang off. Never transforms, so its bounding box is
 *                    stable under the cursor.
 *   - Inner layer  → animated. Spring-lifts on the outer's hover state
 *                    via Framer Motion variant inheritance. Hosts the
 *                    accent border + shadow that grow alongside the lift.
 *
 * Why two layers
 *   A single-layer card that lifts on hover changes its own bounding box
 *   under the cursor. When the cursor sits near the bottom edge, the lift
 *   pulls the card out from under it → `mouseleave` fires → the card
 *   drops → `mouseenter` fires again → oscillation. Splitting hover
 *   detection from the visual lift makes the hover box stable: state
 *   stays true while the inner layer animates above it.
 *
 * Variant tree
 *   The outer enters the `"hover"` variant on `mouseenter`. Variants
 *   propagate down through Framer Motion's React context, so any
 *   descendant `motion` component that defines matching `rest`/`hover`
 *   labels (e.g. RegionCard's image scale) animates on the same tick as
 *   the lift. Single source of truth, zero coordination drift.
 */

type Props = Omit<HTMLMotionProps<'div'>, 'variants' | 'animate' | 'initial' | 'whileHover' | 'whileFocus' | 'transition'> & {
  children: React.ReactNode;
  /** Class for the outer hover-detector wrapper (layout participation). */
  className?: string;
  /** Class for the inner animated chrome wrapper (visual transform target). */
  innerClassName?: string;
};

export function CardShell({ children, className, innerClassName, ...outerProps }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedLiftVariants : liftVariants;

  return (
    <motion.div
      data-slot="card-shell"
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      className={cn('group relative flex h-full flex-col', className)}
      {...outerProps}
    >
      <motion.div
        data-slot="card-shell-chrome"
        variants={variants}
        transition={LIFT_SPRING}
        className={cn('relative flex h-full flex-col will-change-transform', innerClassName)}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
