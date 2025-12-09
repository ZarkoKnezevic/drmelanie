import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc';
import type { StoryblokBlok } from '@/types';

interface SettingsProps {
  blok: StoryblokBlok & {
    header?: StoryblokBlok;
    footer?: StoryblokBlok;
  };
}

/**
 * Settings component - used in Storyblok to wrap header and footer
 * This component doesn't render anything itself, but allows header/footer
 * to be configured in the Storyblok settings story
 */
export default function Settings({ blok }: SettingsProps) {
  // This component is used as a container in Storyblok
  // The actual header/footer are extracted in getGlobalSettings
  // and rendered via GlobalHeader/GlobalFooter components
  return (
    <div {...storyblokEditable(blok)} style={{ display: 'none' }}>
      {blok.header && <StoryblokServerComponent blok={blok.header} />}
      {blok.footer && <StoryblokServerComponent blok={blok.footer} />}
    </div>
  );
}

