import { getGlobalSettings } from '@/lib/storyblok/getGlobalSettings';
import { StoryblokServerComponent } from '@storyblok/react/rsc';
import { logger } from '@/utils';
import type { StoryblokBlok } from '@/types';

export async function HeaderServerWrapper() {
  // This component is only called for non-home pages
  // The Client Component (ConditionalHeaderWrapper) handles pathname detection
  
  try {
    const settings = await getGlobalSettings();

    if (process.env.NODE_ENV === 'development') {
      logger.debug('HeaderServerWrapper - settings:', JSON.stringify(settings, null, 2));
    }

    // Validate header blok before rendering
    if (settings.header && settings.header.component && settings.header._uid) {
      return <StoryblokServerComponent blok={settings.header as StoryblokBlok} />;
    }

    // On non-home pages, if no Storyblok header found, render empty header
    if (process.env.NODE_ENV === 'development') {
      logger.warn('HeaderServerWrapper - No Storyblok header found, rendering empty header');
    }
    return (
      <header className="absolute top-0 z-50 w-full bg-transparent">
        <div className="container flex h-16 items-center justify-between lg:h-24 xl:h-32" />
      </header>
    );
  } catch (error) {
    // On non-home pages, if there's an error, render empty header
    logger.error('Error in HeaderServerWrapper:', error);
    return (
      <header className="absolute top-0 z-50 w-full bg-transparent">
        <div className="container flex h-16 items-center justify-between lg:h-24 xl:h-32" />
      </header>
    );
  }
}

