'use client';

import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import { cn, getBackgroundClass } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface TeaserProps {
  blok: StoryblokBlok & {
    headline: string;
    description?: string;
    image?: {
      filename: string;
      alt?: string;
    };
    link?: {
      url: string;
      cached_url?: string;
    };
    background?: string;
  };
}

export default function Teaser({ blok }: TeaserProps) {
  const linkUrl = blok.link?.cached_url || blok.link?.url || '#';
  const backgroundClass = getBackgroundClass(blok.background);

  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(
        'group rounded-lg border border-gray-200 p-6 shadow-sm transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800',
        backgroundClass || 'bg-white'
      )}
    >
      {blok.image?.filename && (
        <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={blok.image.filename}
            alt={blok.image.alt || blok.headline}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        {blok.headline}
      </h2>
      {blok.description && (
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          {blok.description}
        </p>
      )}
      {blok.link && (
        <a
          href={linkUrl}
          className="inline-block font-semibold text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Read more →
        </a>
      )}
    </div>
  );
}

