'use client';

import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import { cn, getBackgroundClass } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface HeroProps {
  blok: StoryblokBlok & {
    logo?: {
      filename: string;
      alt?: string;
    };
    headline: string;
    image?: {
      filename: string;
      alt?: string;
    };
    cta_text?: string;
    cta_link?: string;
    background?: string;
  };
}

export default function Hero({ blok }: HeroProps) {
  const backgroundClass = getBackgroundClass(blok.background);

  return (
    <section
      {...storyblokEditable(blok)}
      className={cn(
        'hero relative flex flex-col overflow-hidden md:min-h-[80vh] md:flex-row',
        backgroundClass || 'bg-background'
      )}
    >
      {/* Mobile: Image first (flex-column) */}
      {blok.image?.filename && (
        <div className="relative h-[50vh] w-full md:hidden">
          <Image
            src={blok.image.filename}
            alt={blok.image.alt || blok.headline}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Left Section - Logo and Headline (with container) */}
      <div className={cn(
        'relative z-10 flex flex-1 flex-col items-center justify-center py-12 md:py-0',
        'torn-edge torn-edge-top md:torn-edge-top-none',
        backgroundClass || 'bg-background'
      )}>
        <div className="container">
          <div className="w-full md:w-1/2 lg:w-[40%] space-y-6 md:space-y-8">
            {/* Logo */}
            {blok.logo?.filename && (
              <div className="relative h-24 w-full md:h-32 lg:h-40">
                <Image
                  src={blok.logo.filename}
                  alt={blok.logo.alt || 'Logo'}
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            )}

            {/* Headline */}
            <h1 className="h1">
              {blok.headline}
            </h1>
          </div>
        </div>
      </div>

      {/* Right Section - Image (extends to edge, desktop only - flex-row) */}
      {blok.image?.filename && (
        <div className="absolute right-0 top-0 hidden h-full w-[50%] md:block z-10">
          <div className="relative h-full w-full torn-edge torn-edge-right-reverse">
            <Image
              src={blok.image.filename}
              alt={blok.image.alt || blok.headline}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 0vw, 50vw"
            />
          </div>
        </div>
      )}
    </section>
  );
}

