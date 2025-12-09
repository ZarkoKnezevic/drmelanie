import { getGlobalSettings } from '@/lib/storyblok/getGlobalSettings';
import { StoryblokServerComponent } from '@storyblok/react/rsc';
import { SiteFooter } from './site-footer';
import type { StoryblokBlok } from '@/types';

export async function GlobalFooter() {
  try {
    const settings = await getGlobalSettings();

    // Validate footer blok before rendering
    if (settings.footer && settings.footer.component && settings.footer._uid) {
      return <StoryblokServerComponent blok={settings.footer as StoryblokBlok} />;
    }

    // Fallback to default footer
    return <SiteFooter />;
  } catch (error) {
    // If there's any error, fallback to default footer
    console.error('Error rendering GlobalFooter:', error);
    return <SiteFooter />;
  }
}
