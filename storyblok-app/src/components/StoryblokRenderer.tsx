import { StoryblokServerComponent } from '@storyblok/react/rsc';
import { logger } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface StoryblokRendererProps {
  blok: StoryblokBlok;
}

export default function StoryblokRenderer({ blok }: StoryblokRendererProps) {
  if (!blok || !blok.component) {
    return null;
  }

  // Debug: Log component name being rendered
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`Rendering component: ${blok.component}`);
  }

  return <StoryblokServerComponent blok={blok} />;
}

