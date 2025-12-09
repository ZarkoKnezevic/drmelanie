import { getGlobalSettings } from '@/lib/storyblok/getGlobalSettings';
import { StoryblokServerComponent } from '@storyblok/react/rsc';
import { SiteHeader } from './site-header';
import type { StoryblokBlok } from '@/types';

export async function GlobalHeader() {
  try {
    const settings = await getGlobalSettings();

    // Validate header blok before rendering
    if (settings.header && settings.header.component && settings.header._uid) {
      return <StoryblokServerComponent blok={settings.header as StoryblokBlok} />;
    }

    // Fallback to default header
    return <SiteHeader />;
  } catch (error) {
    // If there's any error, fallback to default header
    console.error('Error rendering GlobalHeader:', error);
    return <SiteHeader />;
  }
}

