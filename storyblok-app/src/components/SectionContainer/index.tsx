import { storyblokEditable } from '@storyblok/react/rsc';
import { cn } from '@/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { StoryblokBlok } from '@/types';

interface SectionContainerProps {
  children: React.ReactNode;
  blok: StoryblokBlok & {
    paddingX?: 'none' | 'base' | 'large';
    paddingY?: 'none' | 'base' | 'large';
    marginTop?: 'none' | 'base' | 'large';
    marginBottom?: 'none' | 'base' | 'large';
    maxWidth?: 'base' | 'small' | 'none';
    theme?: string;
    backgroundImage?: {
      filename?: string;
    };
    backgroundGradient?: string;
  };
  className?: string;
}

const outerVariants = cva('', {
  variants: {
    marginTop: {
      none: 'mt-0',
      base: 'mt-8',
      large: 'mt-16',
    },
    marginBottom: {
      none: 'mb-0',
      base: 'mb-8',
      large: 'mb-16',
    },
    backgroundGradient: {
      'gradient-1': 'bg-gradient-to-br from-white to-blue-50',
    },
  },
  defaultVariants: {
    marginTop: 'base',
    marginBottom: 'base',
  },
});

const innerVariants = cva('', {
  variants: {
    paddingX: {
      none: 'px-0',
      base: 'px-4 md:px-6',
      large: 'px-8 md:px-12',
    },
    paddingY: {
      none: 'py-0',
      base: 'py-8',
      large: 'py-16',
    },
    maxWidth: {
      base: 'max-w-screen-xl',
      small: 'max-w-screen-sm',
      none: 'max-w-none',
    },
  },
  defaultVariants: {
    paddingX: 'base',
    paddingY: 'base',
    maxWidth: 'base',
  },
});

export default function SectionContainer({
  children,
  blok,
  className,
}: SectionContainerProps) {
  const {
    _uid,
    paddingX,
    paddingY,
    marginTop,
    marginBottom,
    maxWidth,
    theme,
    backgroundImage,
    backgroundGradient,
  } = blok;

  const style = backgroundImage?.filename
    ? {
        background: `url(${backgroundImage.filename}) no-repeat center/cover`,
      }
    : {};

  return (
    <section
      {...storyblokEditable(blok)}
      className={cn(
        'mx-auto max-w-screen-xl overflow-x-hidden rounded-2xl',
        className,
        theme,
        outerVariants({
          marginTop,
          marginBottom,
          backgroundGradient: backgroundGradient as 'gradient-1' | undefined,
        }),
        {
          'bg-gray-50 dark:bg-gray-900': !!theme && !backgroundGradient,
        }
      )}
      id={_uid}
      style={style}
    >
      <div
        className={cn(
          'mx-auto',
          innerVariants({
            paddingX,
            paddingY,
            maxWidth,
          })
        )}
      >
        {children}
      </div>
    </section>
  );
}

