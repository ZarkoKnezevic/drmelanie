import { StoryblokServerComponent } from '@storyblok/react/rsc';

interface StoryblokRendererProps {
  blok: any;
}

export default function StoryblokRenderer({ blok }: StoryblokRendererProps) {
  if (!blok || !blok.component) {
    return null;
  }

  // Debug: Log component name being rendered
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Rendering component:', blok.component);
  }

  return <StoryblokServerComponent blok={blok} />;
}

