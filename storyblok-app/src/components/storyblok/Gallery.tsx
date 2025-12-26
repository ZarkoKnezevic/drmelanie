import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import { prepareImageProps } from '@/lib/adapters/prepareImageProps';
import { cn, getBackgroundClass, getHeadingColorClass } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface StoryblokImageAsset {
  filename?: string;
  alt?: string;
  asset?: {
    filename?: string;
    alt?: string;
  };
}

interface GalleryProps {
  blok: StoryblokBlok & {
    headline?: string;
    assets?: StoryblokImageAsset[];
    background_color?: string | { slug?: string };
    torn_paper_edges?: boolean;
  };
}

export default function Gallery({ blok }: GalleryProps) {
  const backgroundClass = getBackgroundClass(blok.background_color);
  const headingColorClass = getHeadingColorClass(blok.background_color);
  const hasTornEdges = blok.torn_paper_edges === true;

  // Filter out invalid images
  const validImages = (blok.assets || []).filter(
    (asset) => asset?.filename || asset?.asset?.filename
  );

  if (validImages.length === 0) {
    return null;
  }

  return (
    <section
      {...storyblokEditable(blok)}
      className={cn(
        'gallery relative',
        hasTornEdges && 'torn-edge torn-edge-top torn-edge-bottom',
        backgroundClass || 'bg-background'
      )}
    >
      <div className="spacing container py-10 md:py-12">
        {/* Headline */}
        {blok.headline && (
          <h2 className={cn('mb-8 text-center text-h2 font-semibold md:mb-12', headingColorClass)}>
            {blok.headline}
          </h2>
        )}

        {/* Masonry Grid - Using CSS Columns for true masonry layout like WebKit article */}
        <div className="gallery-grid columns-2 gap-2 md:columns-3 md:gap-4 lg:columns-4 lg:gap-6">
          {validImages.map((asset, index) => {
            const imageProps = prepareImageProps(asset);
            if (!imageProps?.src) return null;

            return (
              <div
                key={index}
                className="gallery-item group relative mb-2 break-inside-avoid overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-md md:mb-4 lg:mb-6"
              >
                <Image
                  src={imageProps.src}
                  alt={imageProps.alt || `Gallery image ${index + 1}`}
                  width={800}
                  height={600}
                  className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  quality={90}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
