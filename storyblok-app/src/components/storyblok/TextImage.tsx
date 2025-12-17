import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import * as motion from 'motion/react-client';
import renderRichText from '@/lib/renderRichText';
import { prepareImageProps } from '@/lib/adapters/prepareImageProps';
import { CornerImage } from '@/components/ui/CornerImage';
import { cn, getBackgroundClass, getBodyColorClass, getHeadingColorClass } from '@/utils';
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
    background_color?: string | { slug?: string }; // Storyblok data source field
    torn_paper_edges?: boolean;
    corner_image_position?: 'left_top' | 'left_bottom' | 'right_top' | 'right_bottom' | 'pattern';
  };
}

export default function TextImage({ blok }: TextImageProps) {
  const imageOnLeft = blok.image_position?.toLowerCase() === 'left';
  const backgroundClass = getBackgroundClass(blok.background_color);
  const headingColorClass = getHeadingColorClass(blok.background_color);
  const bodyColorClass = getBodyColorClass(blok.background_color);
  const hasTornEdges = blok.torn_paper_edges === true;

  return (
    <section
      {...storyblokEditable(blok)}
      className={cn(
        'text-image relative',
        hasTornEdges && 'torn-edge torn-edge-top torn-edge-bottom mb-4',
        backgroundClass
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <CornerImage position={blok.corner_image_position} />
      </div>
      <div className="spacing container relative z-[2]">
        <div
          className={cn(
            'flex flex-col gap-8 md:flex-row md:gap-12 lg:gap-16',
            imageOnLeft && 'md:flex-row-reverse'
          )}
        >
          {/* Text Content */}
          {blok.text && (
            <motion.div
              className={cn(
                'prose prose-lg dark:prose-invert flex max-w-none flex-1 flex-col items-start justify-center',
                headingColorClass,
                bodyColorClass
              )}
              initial={{ opacity: 0, y: -24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {renderRichText(blok.text)}
            </motion.div>
          )}

          {/* Image */}
          {(blok.image?.filename || blok.image?.asset?.filename) && (
            <motion.div
              className="relative aspect-[2/1] w-full flex-1 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            >
              <Image
                {...prepareImageProps(blok.image)}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
