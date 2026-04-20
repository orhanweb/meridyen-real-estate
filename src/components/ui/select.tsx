// src/components/ui/select.tsx
import { ChevronDown } from 'lucide-react';
import { type ComponentProps, forwardRef } from 'react';
import { cn } from '@/lib/cn';

type Props = ComponentProps<'select'>;

const baseClasses = [
  'flex h-11 w-full appearance-none rounded-md border border-input bg-surface px-3.5 pr-10 text-sm text-foreground',
  'shadow-xs transition-[border-color,background-color] duration-200 ease-out-expo',
  /* Border-only focus + invalid feedback. See input.tsx for rationale. */
  'focus-visible:border-ring focus-visible:outline-none',
  'aria-invalid:border-destructive',
  'disabled:cursor-not-allowed disabled:opacity-60',
  /* CSS-only placeholder detection — see `select-placeholder-aware` in globals.css. */
  'select-placeholder-aware'
];

/**
 * Native <select> dressed to match the input/textarea primitives. Native
 * picker delivers free keyboard nav + native mobile UX while we keep full
 * control over the closed-state styling. Placeholder detection is CSS-only
 * (`:has(option[value='']:checked)`) so it stays in sync with both user
 * interaction and programmatic resets (e.g. react-hook-form `reset`).
 */
export const Select = forwardRef<HTMLSelectElement, Props>(function Select({ className, children, ...props }, ref) {
  return (
    <div className="relative">
      <select ref={ref} data-slot="select" className={cn(baseClasses, className)} {...props}>
        {children}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
});
