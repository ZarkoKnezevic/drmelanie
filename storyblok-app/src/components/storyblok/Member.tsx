import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import renderRichText from '@/lib/renderRichText';
import { prepareImageProps } from '@/lib/adapters/prepareImageProps';
import { CornerImage } from '@/components/ui/CornerImage';
import { cn, getBackgroundClass, getHeadingColorClass, getBodyColorClass } from '@/utils';
import { MemberImage, MemberText } from './MemberAnimated';
import type { StoryblokBlok } from '@/types';

interface MemberProps {
  blok: StoryblokBlok & {
    image?: {
      filename?: string;
      alt?: string;
      asset?: {
        filename?: string;
        alt?: string;
      };
    };
    richtext?: Record<string, unknown>; // ISbRichtext from Storyblok
    name_and_title?: string;
    background_color?: string | { slug?: string };
    torn_paper_edges?: boolean;
    corner_image_position?: 'left_top' | 'left_bottom' | 'right_top' | 'right_bottom' | 'pattern';
  };
  isFirst?: boolean;
  isLast?: boolean;
}

export default function Member({ blok, isFirst = false, isLast = false }: MemberProps) {
  const imageProps = blok.image
    ? prepareImageProps({
        filename: blok.image.asset?.filename || blok.image.filename,
        alt: blok.image.asset?.alt || blok.image.alt,
      })
    : null;

  const backgroundClass = getBackgroundClass(blok.background_color);
  const headingColorClass = getHeadingColorClass(blok.background_color);
  const bodyColorClass = getBodyColorClass(blok.background_color);
  const hasTornEdges = blok.torn_paper_edges === true;

  // First child: torn edge on top
  // All in between: torn edge on bottom only
  // Last child: torn edge on bottom
  const tornEdgeClasses = hasTornEdges
    ? cn(
        'torn-edge',
        isFirst && !isLast && 'torn-edge-top', // First (but not last): top only
        !isFirst && 'torn-edge-bottom', // Middle and last: bottom
        isFirst && isLast && 'torn-edge-top torn-edge-bottom' // Single member: both
      )
    : '';

  return (
    <div
      {...storyblokEditable(blok)}
      className={cn(
        'relative w-full overflow-hidden',
        tornEdgeClasses,
        backgroundClass || 'bg-background'
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <CornerImage position={blok.corner_image_position} />
      </div>
      <div className="container relative z-[2] grid grid-cols-1 gap-10 py-12 md:grid-cols-2 md:py-16 lg:grid-cols-3 xl:py-20">
        {/* Image - Mobile: 1 col, Tablet: 1/2, Desktop: 1/3 of container */}
        {imageProps && imageProps.src && (
          <MemberImage delay={0}>
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                {...imageProps}
                alt={imageProps.alt || blok.name_and_title || 'Team member image'}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </MemberImage>
        )}

        {/* Text Content - Mobile: 1 col, Tablet: 1/2, Desktop: 2/3 of container */}
        <div className="flex flex-col justify-center md:col-span-1 lg:col-span-2">
          <MemberText delay={0}>
            {blok.richtext && (
              <div className={cn('mb-4 max-w-none text-body-sm', bodyColorClass)}>
                {renderRichText(blok.richtext)}
              </div>
            )}
            {blok.name_and_title && (
              <h3 className={cn('mt-auto text-h3 font-bold', headingColorClass)}>
                {blok.name_and_title}
              </h3>
            )}
          </MemberText>
        </div>
      </div>
    </div>
  );
}
