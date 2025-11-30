'use client';

import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/components/button';
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
  const linkUrl = blok.cta_link || '#';
  const backgroundClass = getBackgroundClass(blok.background);

  console.log(blok);

  return (
    <section
      {...storyblokEditable(blok)}
      className={cn(
        'relative flex min-h-[80vh] overflow-hidden',
        backgroundClass || 'bg-background'
      )}
    >
      {/* Left Section - Logo and Headline */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-12 lg:px-16">
        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
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

        {/* Torn Paper Effect - Right Edge */}
        <div
          className={cn(
            'absolute right-0 top-0 h-full w-16',
            backgroundClass || 'bg-background'
          )}
          style={{
            clipPath:
              'polygon(0 0, 100% 0, 100% 10%, 96% 15%, 100% 20%, 94% 25%, 100% 30%, 97% 35%, 100% 40%, 95% 45%, 100% 50%, 96% 55%, 100% 60%, 94% 65%, 100% 70%, 97% 75%, 100% 80%, 95% 85%, 100% 90%, 96% 95%, 100% 100%, 0 100%)',
          }}
        />
      </div>

      {/* Right Section - Image */}
      {blok.image?.filename && (
        <div className="relative hidden w-full flex-[1] bg-muted md:block">
          <Image
            src={blok.image.filename}
            alt={blok.image.alt || blok.headline}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 0vw, 33vw"
          />
          {/* CTA Button */}
          {blok.cta_text && blok.cta_link && (
            <div className="absolute right-48 top-10 pt-4">
              <Button asChild variant="secondary">
                <Link href={linkUrl}>{blok.cta_text}</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

