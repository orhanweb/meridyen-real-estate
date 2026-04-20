// src/components/ui/input.tsx
import { type ComponentProps, forwardRef } from 'react';
import { cn } from '@/lib/cn';

type Props = ComponentProps<'input'>;

const baseClasses = [
  'flex h-11 w-full rounded-md border border-input bg-surface px-3.5 text-sm text-foreground',
  'placeholder:text-muted-foreground/70',
  'shadow-xs transition-[border-color,background-color] duration-200 ease-out-expo',
  /* Focus + invalid feedback is border-only — no ring/outline. `outline-none`
     is required to suppress the global :focus-visible outline from globals.css. */
  'focus-visible:border-ring focus-visible:outline-none',
  'aria-invalid:border-destructive',
  'disabled:cursor-not-allowed disabled:opacity-60'
];

/** Text input primitive with shadcn-style focus + invalid affordance. */
export const Input = forwardRef<HTMLInputElement, Props>(function Input({ className, type = 'text', ...props }, ref) {
  return <input ref={ref} type={type} data-slot="input" className={cn(baseClasses, className)} {...props} />;
});
