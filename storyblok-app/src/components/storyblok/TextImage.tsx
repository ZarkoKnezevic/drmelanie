'use client';

import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import renderRichText from '@/lib/renderRichText';
import { prepareImageProps } from '@/lib/adapters/prepareImageProps';
import type { StoryblokBlok } from '@/types';

interface TextImageProps {
  blok: StoryblokBlok & {
    text?: any; // ISbRichtext - richtext content from Storyblok
    image?: {
      filename?: string;
      alt?: string;
      asset?: {
        filename?: string;
        alt?: string;
      };
    };
    image_position?: string;
  };
}

export default function TextImage({ blok }: TextImageProps) {
  const imageOnLeft = blok.image_position?.toLowerCase() === 'left';

  return (
    <section
      {...storyblokEditable(blok)}
      className="container mx-auto px-6 py-12 md:py-16 lg:py-20"
    >
      <div
        className={`flex flex-col gap-8 md:flex-row md:gap-12 lg:gap-16 ${
          imageOnLeft ? 'md:flex-row-reverse' : ''
        }`}
      >
        {/* Text Content */}
        {blok.text && (
          <div className="flex-1 prose prose-lg max-w-none dark:prose-invert">
            {renderRichText(blok.text)}
          </div>
        )}

        {/* Image */}
        {(blok.image?.filename || blok.image?.asset?.filename) && (
          <div className="relative aspect-[2/1] w-full flex-1 overflow-hidden">
            <Image
              {...prepareImageProps(blok.image)}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
      </div>
    </section>
  );
}

