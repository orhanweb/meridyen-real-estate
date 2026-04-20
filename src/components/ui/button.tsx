// src/components/ui/button.tsx
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium',
    'transition-[transform,background-color,color,border-color,box-shadow] duration-300 ease-[var(--ease-out-expo)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    'active:scale-[0.98] will-change-transform'
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:brightness-110',
        accent: 'bg-accent text-accent-foreground shadow-sm hover:shadow-md hover:brightness-105',
        outline: 'border border-border bg-transparent text-foreground hover:bg-muted',
        ghost: 'bg-transparent text-foreground hover:bg-muted',
        link: 'bg-transparent text-foreground underline-offset-4 hover:underline px-0',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:brightness-110'
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        xl: 'h-14 px-9 text-base',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
