// src/components/ui/textarea.tsx
import { type ComponentProps, forwardRef } from 'react';
import { cn } from '@/lib/cn';

type Props = ComponentProps<'textarea'>;

const baseClasses = [
  'flex min-h-32 w-full rounded-md border border-input bg-surface px-3.5 py-3 text-sm text-foreground',
  'placeholder:text-muted-foreground/70',
  'shadow-xs transition-[border-color,background-color] duration-200 ease-out-expo',
  /* Border-only focus + invalid feedback. See input.tsx for rationale. */
  'focus-visible:border-ring focus-visible:outline-none',
  'aria-invalid:border-destructive',
  'disabled:cursor-not-allowed disabled:opacity-60',
  'resize-y'
];

/** Multiline text input primitive — sized for 4-6 line messages by default. */
export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea({ className, rows = 5, ...props }, ref) {
  return <textarea ref={ref} rows={rows} data-slot="textarea" className={cn(baseClasses, className)} {...props} />;
});
