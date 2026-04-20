// src/components/ui/checkbox.tsx
import { Check } from 'lucide-react';
import { type ComponentProps, type ReactNode, forwardRef, useId } from 'react';
import { cn } from '@/lib/cn';

type Props = Omit<ComponentProps<'input'>, 'type' | 'children'> & {
  /** Visible label rendered next to the checkbox. */
  label: ReactNode;
  /** Resolved (localized) error string — drives invalid styling + role=alert. */
  error?: string;
  /** Hint shown below the label when there is no error. */
  hint?: ReactNode;
};

/**
 * Accessible checkbox primitive. Renders a real native input (handles all
 * keyboard + screen-reader semantics) with a visually styled mark on top.
 * Using the `peer` pattern keeps the visible state in sync with the input.
 */
export const Checkbox = forwardRef<HTMLInputElement, Props>(function Checkbox({ id, label, error, hint, className, required, ...props }, ref) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={inputId} className="group flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            'mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-[5px] border border-input bg-surface',
            'transition-[background-color,border-color] duration-200 ease-out-expo',
            /* Checked: editorial navy (primary) + cream tick — pairs with the
               primary button. Reads instantly as "selected" on either theme. */
            'peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground',
            'group-hover:border-foreground/50 peer-checked:group-hover:brightness-110',
            /* Border-only focus + invalid — invalid listed last so it wins
               over both `peer-checked` (primary) and `peer-focus-visible` (ring). */
            'peer-focus-visible:border-ring',
            'peer-aria-invalid:border-destructive',
            className
          )}
        >
          <Check className="size-3.5 scale-0 transition-transform duration-200 ease-out-expo group-has-checked:scale-100" strokeWidth={3} />
        </span>
        <span className="text-muted-foreground">
          {label}
          {required ? (
            <span aria-hidden="true" className="ml-1 text-accent">
              *
            </span>
          ) : null}
        </span>
      </label>

      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
