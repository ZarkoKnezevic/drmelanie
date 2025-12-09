import { headers } from 'next/headers';
import { getGlobalSettings } from '@/lib/storyblok/getGlobalSettings';
import { StoryblokServerComponent } from '@storyblok/react/rsc';
import { SiteHeader } from './site-header';
import type { StoryblokBlok } from '@/types';

export async function HeaderServerWrapper() {
  // Get pathname from headers set by middleware
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  const isHomePage = pathname === '/' || pathname === '/home';

  // On home page, always use SiteHeader
  if (isHomePage) {
    return <SiteHeader />;
  }

  // On other pages, fetch and use Storyblok header
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
    console.error('Error in HeaderServerWrapper:', error);
    return <SiteHeader />;
  }
}

