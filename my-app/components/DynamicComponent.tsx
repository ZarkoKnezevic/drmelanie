'use client';

import { useStoryblokState, StoryblokComponent } from '@storyblok/react/rsc';

interface DynamicComponentProps {
  blok: any;
}

export default function DynamicComponent({ blok }: DynamicComponentProps) {
  const storyblokState = useStoryblokState(blok);

  if (!blok || !blok.component) {
    return <div>Component not found</div>;
  }

  return <StoryblokComponent blok={storyblokState} />;
}

