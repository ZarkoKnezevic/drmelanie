import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const buttonVariants = cva(
  'button inline-flex items-center justify-center gap-2 whitespace-nowrap py-[14px] px-6 font-semibold transition-all duration-200 ease-in-out ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--button-primary)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-hover)] rounded-[10px] md:rounded-[12px] shadow-sm hover:shadow-md',
        secondary:
          'bg-[var(--button-secondary)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-hover)] rounded-[10px] md:rounded-[12px] shadow-sm hover:shadow-md',
        tertiary:
          'bg-[var(--button-tertiary)] text-[var(--button-tertiary-text)] border-2 border-[var(--button-tertiary-border)] hover:bg-[var(--button-tertiary-hover)] rounded-[10px]',
        quaternary:
          'bg-[var(--button-quaternary)] text-[var(--button-quaternary-text)] hover:bg-[var(--button-quaternary-hover)] rounded-[12px] shadow-sm hover:shadow-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
