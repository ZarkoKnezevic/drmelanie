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
          'bg-[var(--button-primary)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-hover)] disabled:bg-[var(--button-primary-disabled-bg)] disabled:text-[var(--button-primary-disabled-text)] rounded-[10px] md:rounded-[12px] shadow-sm hover:shadow-md',
        secondary:
          'bg-[var(--button-secondary)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-hover)] disabled:bg-[var(--button-secondary-disabled-bg)] rounded-[10px] md:rounded-[12px] shadow-sm hover:shadow-md',
        tertiary:
          'bg-[var(--button-tertiary)] text-[var(--button-tertiary-text)] border border-[var(--button-tertiary-border)] hover:bg-[var(--button-tertiary-hover)] disabled:bg-[var(--button-tertiary-disabled-bg)] disabled:text-[var(--button-tertiary-disabled-text)] rounded-[10px]',
        quaternary:
          'bg-[var(--button-quaternary)] text-[var(--button-quaternary-text)] border-[1.5px] border-[var(--button-quaternary-border)] hover:bg-[var(--button-quaternary-hover)] hover:border-[var(--button-quaternary-hover-border)] disabled:text-[var(--button-quaternary-disabled-text)] disabled:border-[var(--button-quaternary-disabled-border)] rounded-[10px]',
        quinary:
          'bg-[var(--button-quinary)] text-[var(--button-quinary-text)] hover:bg-[var(--button-quinary-hover)] disabled:bg-[var(--button-quinary-disabled-bg)] disabled:text-[var(--button-quinary-disabled-text)] rounded-[10px] md:rounded-[12px] shadow-sm hover:shadow-md',
        senary:
          'bg-[var(--button-senary)] text-[var(--button-senary-text)] border-[1.5px] border-[var(--button-senary-border)] hover:bg-[var(--button-senary-hover)] hover:border-[var(--button-senary-hover-border)] disabled:text-[var(--button-senary-disabled-text)] disabled:border-[var(--button-senary-disabled-border)] rounded-[10px] md:rounded-[12px]',
        septenary:
          'bg-[var(--button-septenary)] text-[var(--button-septenary-text)] border-[1.5px] border-[var(--button-septenary-border)] hover:bg-[var(--button-septenary-hover)] hover:border-[var(--button-septenary-hover-border)] disabled:bg-[var(--button-septenary-disabled-bg)] disabled:text-[var(--button-septenary-disabled-text)] disabled:border-[var(--button-septenary-disabled-border)] rounded-[10px] md:rounded-[12px]',
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
