'use client';

import { storyblokEditable } from '@storyblok/react/rsc';
import { cn, getBackgroundClass } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface FeatureProps {
  blok: StoryblokBlok & {
    name: string;
    description?: string;
    icon?: string;
    background?: string;
  };
}

export default function Feature({ blok }: FeatureProps) {
  const backgroundClass = getBackgroundClass(blok.background);

  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(
        'flex flex-col items-center rounded-lg p-6 text-center dark:bg-gray-800',
        backgroundClass || 'bg-gray-50'
      )}
    >
      {blok.icon && (
        <div className="mb-4 text-4xl" role="img" aria-label={blok.name}>
          {blok.icon}
        </div>
      )}
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        {blok.name}
      </h3>
      {blok.description && (
        <p className="text-gray-600 dark:text-gray-300">{blok.description}</p>
      )}
    </div>
  );
}

