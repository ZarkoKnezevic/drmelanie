import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import { prepareImageProps } from '@/lib/adapters/prepareImageProps';
import { cn, getBackgroundClass } from '@/utils';
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
    background?: string;
  };
}

export default function HeroMedia({ blok }: HeroMediaProps) {
  const backgroundClass = getBackgroundClass(blok.background);

  // Check if video boolean is enabled
  const useVideo = blok.video === true;

  // If video is enabled, use the public video file
  if (useVideo) {
    return (
      <section
        {...storyblokEditable(blok)}
        className={cn(
          'hero-media relative h-[60vh] w-full overflow-hidden lg:h-[90vh]',
          backgroundClass || 'bg-background'
        )}
      >
        <video autoPlay loop muted playsInline className="h-full w-full object-cover">
          <source src="/videos/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
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
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
    </section>
  );
}
