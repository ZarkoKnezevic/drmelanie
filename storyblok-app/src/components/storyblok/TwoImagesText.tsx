import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc';
import Image from 'next/image';
import * as motion from 'motion/react-client';
import renderRichText from '@/lib/renderRichText';
import { prepareImageProps } from '@/lib/adapters/prepareImageProps';
import { CornerImage } from '@/components/ui/CornerImage';
import { cn, getBackgroundClass, getHeadingColorClass, getBodyColorClass } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface StoryblokImageAsset {
  filename?: string;
  alt?: string;
  asset?: {
    filename?: string;
    alt?: string;
  };
}

interface TwoImagesTextProps {
  blok: StoryblokBlok & {
    text?: any; // ISbRichtext - richtext content from Storyblok
    image_1?: StoryblokImageAsset;
    image_2?: StoryblokImageAsset;
    columns?: StoryblokBlok[];
    items?: StoryblokBlok[];
    columns_content?: StoryblokBlok[];
    content?: StoryblokBlok[];
    background_color?: string | { slug?: string };
    torn_paper_edges?: boolean;
    corner_image_position?: 'left_top' | 'left_bottom' | 'right_top' | 'right_bottom' | 'pattern';
  };
}

export default function TwoImagesText({ blok }: TwoImagesTextProps) {
  const backgroundClass = getBackgroundClass(blok.background_color);
  const headingColorClass = getHeadingColorClass(blok.background_color);
  const bodyColorClass = getBodyColorClass(blok.background_color);
  const hasTornEdges = blok.torn_paper_edges === true;

  // Get nested items/columns from various possible field names
  const nestedItems = blok.columns || blok.items || blok.columns_content || blok.content || [];

  const image1Props = blok.image_1 ? prepareImageProps(blok.image_1) : null;
  const image2Props = blok.image_2 ? prepareImageProps(blok.image_2) : null;

  return (
    <section
      {...storyblokEditable(blok)}
      className={cn(
        'two-images-text relative',
        hasTornEdges && 'torn-edge torn-edge-top torn-edge-bottom mb-4',
        backgroundClass
      )}
    >
      <div className="overflow-hidden">
        <CornerImage position={blok.corner_image_position} />
      </div>
      <div className="spacing container relative z-[2]">
        {/* Two Images */}
        {(image1Props?.src || image2Props?.src) && (
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {image1Props?.src && (
              <motion.div
                className="relative aspect-[4/3] w-full overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ transformOrigin: 'center' }}
              >
                <Image
                  src={image1Props.src}
                  alt={image1Props.alt || 'Image 1'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={90}
                />
              </motion.div>
            )}
            {image2Props?.src && (
              <motion.div
                className="relative aspect-[4/3] w-full overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                style={{ transformOrigin: 'center' }}
              >
                <Image
                  src={image2Props.src}
                  alt={image2Props.alt || 'Image 2'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={90}
                />
              </motion.div>
            )}

            {/* Rich Text Content */}
            <div className="flex flex-col md:col-span-2 xl:col-span-1">
              {blok.text && (
                <motion.div
                  className={cn(
                    'prose prose-lg dark:prose-invert mx-auto max-w-none',
                    headingColorClass,
                    bodyColorClass
                  )}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                >
                  {renderRichText(blok.text)}
                </motion.div>
              )}

              {/* Nested Column Components */}
              {nestedItems.length > 0 && (
                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {nestedItems.map((item: StoryblokBlok) => (
                    <StoryblokServerComponent key={item._uid} blok={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
