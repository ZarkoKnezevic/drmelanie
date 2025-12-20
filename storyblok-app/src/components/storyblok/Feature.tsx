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
              // Images are in color on mobile, grayscale only on md and up for index 1 and 2
              isGrayscale && 'md:grayscale'
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 33vw"
            quality={90}
          />
        </div>
      )}
      <div className="flex w-full flex-col items-center p-6 text-center">
        {blok.name && (
          <h3
            className={cn(
              'mb-2 text-xl font-semibold text-[#c7017f]',
              isFirst && 'md:text-[#3a3a3a]'
            )}
          >
            {blok.name}
          </h3>
        )}
        {blok.description && (
          <p className={cn('text-[#c7017f]', isFirst && 'md:text-[#3a3a3a]')}>{blok.description}</p>
        )}
      </div>
    </div>
  );
}
