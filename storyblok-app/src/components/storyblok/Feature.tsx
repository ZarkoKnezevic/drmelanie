'use client';

import { storyblokEditable } from '@storyblok/react/rsc';
import type { StoryblokBlok } from '@/types';

interface FeatureProps {
  blok: StoryblokBlok & {
    name: string;
    description?: string;
    icon?: string;
  };
}

export default function Feature({ blok }: FeatureProps) {
  return (
    <div
      {...storyblokEditable(blok)}
      className="flex flex-col items-center rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-800"
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

