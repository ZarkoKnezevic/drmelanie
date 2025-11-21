import { StoryblokServerComponent, storyblokEditable } from '@storyblok/react/rsc';
import { logger } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface PageProps {
  blok: StoryblokBlok & {
    body?: StoryblokBlok[];
  };
}

export default function Page({ blok }: PageProps) {
  // Debug: Log nested components being rendered
  if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
    logger.debug(`Page component rendering body with ${blok.body?.length || 0} items`);
    blok.body?.forEach((nestedBlok: StoryblokBlok, index: number) => {
      logger.debug(`  [${index}] Component: "${nestedBlok.component}"`);
    });
  }

  return (
    <main {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok: StoryblokBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
}

