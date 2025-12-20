import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import { prepareImageProps } from '@/lib/adapters/prepareImageProps';
import { cn, getBackgroundClass } from '@/utils';
import { HeroMediaVideo } from './HeroMediaVideo';
import type { StoryblokBlok } from '@/types';

interface HeroMediaProps {
  blok: StoryblokBlok & {
    media?: {
      filename?: string;
      alt?: string;
      asset?: {
        filename?: string;
        alt?: string;
        fieldtype?: string;
      };
      fieldtype?: string;
    };
    // Boolean field to enable video from public folder
    video?: boolean;
    // Number of frames for frame-based animation
    frame_count?: number;
    background_color?: string | { slug?: string };
  };
}

export default function HeroMedia({ blok }: HeroMediaProps) {
  const backgroundClass = getBackgroundClass(blok.background_color);

  // Check if video boolean is enabled (for frame-based animation)
  const useVideo = blok.video === true;
  const frameCount = typeof blok.frame_count === 'number' ? blok.frame_count : 207;

  // If video is enabled, use frame-based scroll animation
  if (useVideo) {
    return (
      <section
        {...storyblokEditable(blok)}
        className={cn(
          'hero-media relative w-full overflow-hidden',
          backgroundClass || 'bg-background'
        )}
        style={{ margin: 0, padding: 0 }}
      >
        <HeroMediaVideo frameCount={frameCount} />
      </section>
    );
  }

  // Otherwise, use the media field (image)
  const mediaAsset = blok.media?.asset || blok.media;
  const mediaFilename = mediaAsset?.filename || blok.media?.filename;
  const mediaAlt = mediaAsset?.alt || blok.media?.alt || '';

  if (!mediaFilename) {
    return null;
  }

  return (
    <section
      {...storyblokEditable(blok)}
      className={cn(
        'hero-media relative h-[60vh] w-full overflow-hidden lg:h-[90vh]',
        backgroundClass || 'bg-background'
      )}
    >
      {/* Image element */}
      <div className="relative h-full w-full">
        <Image
          {...prepareImageProps(blok.media)}
          alt={mediaAlt}
          className="lg:object-center-top object-cover object-left-top"
          sizes="100vw"
          priority
          quality={90}
        />
      </div>
    </section>
  );
}
