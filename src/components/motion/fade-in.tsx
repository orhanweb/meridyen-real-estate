// src/components/motion/fade-in.tsx
'use client';

import { motion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

type Props = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: Direction;
  once?: boolean;
  amount?: number;
};

const offsetFor = (direction: Direction, distance: number) => {
  switch (direction) {
    case 'up':
      return { y: distance };
    case 'down':
      return { y: -distance };
    case 'left':
      return { x: distance };
    case 'right':
      return { x: -distance };
    default:
      return {};
  }
};

/** Composable viewport-triggered fade/slide. Uses transform/opacity only. */
export function FadeIn({ children, delay = 0, duration = 0.7, distance = 24, direction = 'up', once = true, amount = 0.3, ...rest }: Props) {
  const offset = offsetFor(direction, distance);

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
