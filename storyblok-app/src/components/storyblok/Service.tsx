'use client';

import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import { prepareImageProps } from '@/lib/adapters/prepareImageProps';
import { cn } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface StoryblokImageAsset {
  filename?: string;
  alt?: string;
  asset?: {
    filename?: string;
    alt?: string;
  };
}

interface ServiceProps {
  blok: StoryblokBlok & {
    icon?: StoryblokImageAsset;
    name?: string;
  };
}

export default function Service({ blok }: ServiceProps) {
  const iconProps = blok.icon ? prepareImageProps(blok.icon) : null;

  return (
    <div
      {...storyblokEditable(blok)}
      className="service flex flex-col items-center gap-4 bg-white p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
    >
      {iconProps?.src && (
        <div className="relative h-16 w-16 shrink-0" role="img" aria-label={blok.name}>
          <Image
            src={iconProps.src}
            alt={iconProps.alt || blok.name || 'Service icon'}
            fill
            className="object-contain"
            sizes="64px"
          />
        </div>
      )}
      {blok.name && (
        <h3 className="text-body-md font-semibold text-mauve">{blok.name}</h3>
      )}
    </div>
  );
}

