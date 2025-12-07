'use client';

import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import { prepareImageProps } from '@/lib/adapters/prepareImageProps';
import { cn, getBackgroundClass } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface StoryblokImageAsset {
  filename?: string;
  alt?: string;
  asset?: {
    filename?: string;
    alt?: string;
  };
}

interface FeatureProps {
  blok: StoryblokBlok & {
    name?: string;
    description?: string;
    image?: StoryblokImageAsset;
    icon?: StoryblokImageAsset;
    background?: string;
  };
}

export default function Feature({ blok }: FeatureProps) {
  const backgroundClass = getBackgroundClass(blok.background);
  const imageProps = blok.image ? prepareImageProps(blok.image) : null;
  const iconProps = blok.icon ? prepareImageProps(blok.icon) : null;

  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(
        'flex flex-col items-center overflow-hidden rounded-lg dark:bg-gray-800',
        backgroundClass || 'bg-gray-50'
      )}
    >
      {imageProps?.src && (
        <div
          className="relative mb-4 aspect-[16/9] w-full overflow-hidden"
          role="img"
          aria-label={blok.name}
        >
          <Image
            src={imageProps.src}
            alt={imageProps.alt || blok.name || 'Feature image'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="flex w-full flex-col items-center p-6 text-center">
        {blok.name && (
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{blok.name}</h3>
        )}
        {blok.description && <p className="text-gray-600 dark:text-gray-300">{blok.description}</p>}
      </div>
    </div>
  );
}
