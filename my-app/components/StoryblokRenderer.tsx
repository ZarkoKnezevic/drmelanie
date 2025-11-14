'use client';

import { StoryblokServerComponent } from '@storyblok/react/rsc';

interface StoryblokRendererProps {
  blok: any;
}

export default function StoryblokRenderer({ blok }: StoryblokRendererProps) {
  if (!blok || !blok.component) {
    return null;
  }

  return <StoryblokServerComponent blok={blok} />;
}

