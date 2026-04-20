// src/components/motion/stagger.tsx
'use client';

import { motion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

type StaggerProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children: ReactNode;
  delayChildren?: number;
  staggerChildren?: number;
  amount?: number;
  once?: boolean;
};

/** Parent that orchestrates a viewport-triggered stagger across direct children. */
export function Stagger({ children, delayChildren = 0, staggerChildren = 0.08, amount = 0.2, once = true, ...rest }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        visible: { transition: { delayChildren, staggerChildren } }
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type ItemProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children: ReactNode;
  distance?: number;
  duration?: number;
};

/** Single staggered item. Place under <Stagger>. */
export function StaggerItem({ children, distance = 20, duration = 0.7, ...rest }: ItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0, transition: { duration, ease: [0.16, 1, 0.3, 1] } }
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
