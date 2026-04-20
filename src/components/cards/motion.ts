// src/components/cards/motion.ts
import type { Variants } from 'motion/react';

/**
 * Single source of truth for every interactive card's lift.
 *
 * Tuned once and shared by Service, Region and Testimonial cards so the
 * three sections feel like part of the same product, not three different
 * sites. Tweak here, every card updates in lockstep.
 */

/**
 * Editorial weighted-lift spring:
 *   - stiffness 260 → responds promptly to cursor entry, no laggy start
 *   - damping 26    → settles cleanly without overshoot or wobble
 *   - mass 0.9      → tactile presence, not an empty visual cue
 *   - restDelta     → snaps to rest cleanly so the GPU layer is released
 */
export const LIFT_SPRING = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 26,
  mass: 0.9,
  restDelta: 0.001
} as const;

/** Distance the inner chrome lifts on hover (px, negative = upward). */
export const LIFT_DISTANCE_PX = -10;

/** Variants applied to the animated inner chrome of every interactive card. */
export const liftVariants: Variants = {
  rest: { y: 0 },
  hover: { y: LIFT_DISTANCE_PX }
};

/** Reduced-motion fallback — keeps the variant labels intact, neutralises the lift. */
export const reducedLiftVariants: Variants = {
  rest: { y: 0 },
  hover: { y: 0 }
};

/**
 * Easing curve shared by transforms that should run alongside the lift
 * (region image scale, testimonial decoration moves, …). Same curve used
 * across the design system so secondary motions never read as "off-tempo".
 */
export const CARD_EASING = [0.16, 1, 0.3, 1] as const;

/**
 * CSS hover chrome — border + shadow shift applied to the Card surface
 * inside every interactive card. Lives in CSS rather than Framer because
 * box-shadow and border-color belong to the GPU compositor's paint
 * pipeline; running them through React state would re-render dozens of
 * styles every frame for no visible benefit.
 *
 * The `group-hover:` triggers fire from `CardShell`'s outer hover state,
 * so they paint on the same `:hover` event that drives the spring lift —
 * lift and chrome change land together without coordination drift.
 *
 * Apply via `className={cn(CARD_HOVER_CHROME, …)}` on the inner `Card`.
 */
export const CARD_HOVER_CHROME =
  'transition-[box-shadow,border-color] duration-500 ease-[var(--ease-out-expo)] group-hover:border-accent/60 group-hover:shadow-[0_30px_60px_-22px_oklch(from_var(--color-foreground)_l_c_h/0.32),0_12px_24px_-14px_oklch(from_var(--color-foreground)_l_c_h/0.14)]';
