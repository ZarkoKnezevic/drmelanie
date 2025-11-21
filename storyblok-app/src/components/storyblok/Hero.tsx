'use client';

import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import type { StoryblokBlok } from '@/types';

interface HeroProps {
  blok: StoryblokBlok & {
    headline: string;
    subheadline?: string;
    background_image?: {
      filename: string;
      alt?: string;
    };
    cta_text?: string;
    cta_link?: string;
  };
}

export default function Hero({ blok }: HeroProps) {
  return (
    <section
      {...storyblokEditable(blok)}
      className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700"
    >
      {blok.background_image?.filename && (
        <div className="absolute inset-0 z-0">
          <Image
            src={blok.background_image.filename}
            alt={blok.background_image.alt || blok.headline}
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
      )}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
        <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
          {blok.headline}
        </h1>
        {blok.subheadline && (
          <p className="mb-8 text-xl text-blue-100 md:text-2xl">
            {blok.subheadline}
          </p>
        )}
        {blok.cta_text && blok.cta_link && (
          <a
            href={blok.cta_link}
            className="inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-transform hover:scale-105"
          >
            {blok.cta_text}
          </a>
        )}
      </div>
    </section>
  );
}

