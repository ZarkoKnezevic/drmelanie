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
      <div className="container py-10 md:py-12">
        {/* Headline */}
        {blok.headline && (
          <h2
            className={cn(
              'mb-8 text-center text-h2 font-semibold md:mb-12',
              headingColorClass
            )}
          >
            {blok.headline}
          </h2>
        )}

        {/* Masonry Grid */}
        <div className="gallery-grid grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {validImages.map((asset, index) => {
            const imageProps = prepareImageProps(asset);
            if (!imageProps?.src) return null;

            // Vary image heights for masonry effect - creates natural masonry layout
            const heightVariants = [
              'h-48 md:h-64 lg:h-80',
              'h-56 md:h-72 lg:h-96',
              'h-44 md:h-60 lg:h-72',
              'h-52 md:h-68 lg:h-88',
              'h-50 md:h-66 lg:h-84',
              'h-54 md:h-70 lg:h-92',
            ];
            const heightClass = heightVariants[index % heightVariants.length];

            return (
              <div
                key={index}
                className={cn(
                  'gallery-item group relative overflow-hidden rounded-lg shadow-sm transition-shadow duration-300 hover:shadow-md',
                  heightClass
                )}
              >
                <Image
                  src={imageProps.src}
                  alt={imageProps.alt || `Gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

