'use client';

import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc';

interface GridProps {
  blok: {
    _uid: string;
    component: string;
    columns?: number;
    gap?: string;
    items?: any[];
    [key: string]: any;
  };
}

export default function Grid({ blok }: GridProps) {
  const columns = blok.columns || 3;
  const gap = blok.gap || '6';

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  const gapClass = {
    '0': 'gap-0',
    '1': 'gap-1',
    '2': 'gap-2',
    '3': 'gap-3',
    '4': 'gap-4',
    '5': 'gap-5',
    '6': 'gap-6',
    '8': 'gap-8',
    '10': 'gap-10',
    '12': 'gap-12',
  }[gap] || 'gap-6';

  return (
    <div
      {...storyblokEditable(blok)}
      className={`grid ${gridCols} ${gapClass} container mx-auto px-6 py-12`}
    >
      {blok.items?.map((nestedBlok: any) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}

