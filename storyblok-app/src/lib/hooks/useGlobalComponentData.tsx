'use client';

import type { SbBlokData } from '@storyblok/react/rsc';
import type { StoryblokStory } from '@/types';
import { useDataContext } from '@/components/DataContext';

export const useGlobalComponentData = (
  globalComponent: string | SbBlokData
): StoryblokStory | null => {
  const { globalComponentsStories } = useDataContext();

  if (!globalComponent) return null;

  const globalComponentData = globalComponentsStories.find(
    (s) => s.uuid === globalComponent
  );

  return globalComponentData || null;
};

