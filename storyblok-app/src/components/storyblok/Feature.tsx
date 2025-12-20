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
    background_color?: string | { slug?: string };
  };
  isFirst?: boolean;
  index?: number;
}

export default function Feature({ blok, isFirst = false, index = 0 }: FeatureProps) {
  const backgroundClass = getBackgroundClass(blok.background_color);
  const imageProps = blok.image ? prepareImageProps(blok.image) : null;
  // Apply grayscale filter to second and third cards (index 1 and 2)
  const isGrayscale = index === 1 || index === 2;

  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(
        'flex flex-col items-center overflow-hidden rounded-lg',
        backgroundClass || 'bg-white'
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
            className={cn(
              'object-cover transition-all duration-300',
              isGrayscale && 'md:grayscale'
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="flex w-full flex-col items-center p-6 text-center">
        {blok.name && (
          <h3 className={cn('mb-2 text-xl font-semibold', isFirst && 'text-[#3a3a3a]')}>
            {blok.name}
          </h3>
        )}
        {blok.description && <p className={cn(isFirst && 'text-[#3a3a3a]')}>{blok.description}</p>}
      </div>
    </div>
  );
}
