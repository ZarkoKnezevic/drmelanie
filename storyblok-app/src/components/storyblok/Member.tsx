import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import { StoryblokServerComponent } from '@storyblok/react/rsc';
import renderRichText from '@/lib/renderRichText';
import { prepareImageProps } from '@/lib/adapters/prepareImageProps';
import { cn } from '@/utils';
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
    richtext?: any; // ISbRichtext
    name_and_title?: string;
  };
}

export default function Member({ blok }: MemberProps) {
  const imageProps = blok.image
    ? prepareImageProps({
        filename: blok.image.asset?.filename || blok.image.filename,
        alt: blok.image.asset?.alt || blok.image.alt,
      })
    : null;

  return (
    <div
      {...storyblokEditable(blok)}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {/* Image - Mobile: 1 col, Tablet: 1/2, LG+: 1/3 */}
      {imageProps && (
        <div className="relative aspect-square w-full overflow-hidden md:col-span-1 lg:col-span-1">
          <Image
            {...imageProps}
            className="h-full w-full object-cover"
            sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Text Content - Mobile: 1 col, Tablet: 1/2, LG+: 2/3 */}
      <div className="flex flex-col justify-center md:col-span-1 lg:col-span-2">
        {blok.richtext && (
          <div className="mb-4 max-w-none text-body-sm" style={{ color: '#2b2b2' }}>
            {renderRichText(blok.richtext)}
          </div>
        )}
        {blok.name_and_title && (
          <h3 className="mt-auto text-h3 font-bold" style={{ color: '#8a6d7b' }}>
            {blok.name_and_title}
          </h3>
        )}
      </div>
    </div>
  );
}
