// src/components/ui/label.tsx
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

type Props = ComponentProps<'label'> & {
  required?: boolean;
};

/**
 * Form label primitive. Accepts an optional `required` flag that appends a
 * subtle accent asterisk — wrapped in a hidden span for screen readers via
 * `aria-required` on the matching control.
 */
export function Label({ className, required, children, ...props }: Props) {
  return (
    <label className={cn('flex items-center gap-1 text-sm font-medium text-foreground', className)} {...props}>
      {children}
      {required ? (
        <span aria-hidden="true" className="text-accent">
          *
        </span>
      ) : null}
    </label>
  );
}
