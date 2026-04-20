// src/components/ui/field.tsx
import { AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/cn';

type FieldProps = {
  /** Stable id used for `htmlFor` + ARIA wiring. */
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  /** Validation error already resolved to a localized string. */
  error?: string;
  required?: boolean;
  className?: string;
  /** Render-prop receives the ARIA wiring and applies it to the control. */
  children: (controlProps: ControlA11yProps) => ReactNode;
};

export type ControlA11yProps = {
  id: string;
  'aria-invalid': boolean;
  'aria-required'?: boolean;
  'aria-describedby'?: string;
};

/**
 * Form field shell. Owns the label / hint / error layout and exposes the
 * correct ARIA wiring to its control via render-prop. Animated error swap
 * uses Motion to avoid layout jank.
 */
export function Field({ id, label, hint, error, required, className, children }: FieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>

      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-required': required || undefined,
        'aria-describedby': describedBy
      })}

      <div className="min-h-5">
        <AnimatePresence initial={false} mode="wait">
          {error ? (
            <motion.p
              key="error"
              id={errorId}
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-1.5 text-xs font-medium text-destructive"
            >
              <AlertCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
              <span>{error}</span>
            </motion.p>
          ) : hint ? (
            <motion.p
              key="hint"
              id={hintId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-xs text-muted-foreground"
            >
              {hint}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
