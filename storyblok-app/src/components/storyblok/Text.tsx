import { storyblokEditable } from '@storyblok/react/rsc';
import { CornerImage } from '@/components/ui/CornerImage';
import * as motion from 'motion/react-client';
import renderRichText from '@/lib/renderRichText';
import { cn, getBackgroundClass, getHeadingColorClass, getBodyColorClass } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface TextProps {
  blok: StoryblokBlok & {
    topline?: string;
    headline?: string;
    richtext?: Record<string, unknown>; // ISbRichtext - richtext content from Storyblok
    alignment?: 'left' | 'center' | 'right';
    background_color?: string | { slug?: string };
    torn_paper_edges?: boolean;
    corner_image_position?: 'left_top' | 'left_bottom' | 'right_top' | 'right_bottom' | 'pattern';
  };
}

export default function Text({ blok }: TextProps) {
  const backgroundClass = getBackgroundClass(blok.background_color);
  const headingColorClass = getHeadingColorClass(blok.background_color);
  const bodyColorClass = getBodyColorClass(blok.background_color);
  const hasTornEdges = blok.torn_paper_edges === true;
  const alignment = blok.alignment || 'left';

  return (
    <section
      {...storyblokEditable(blok)}
      className={cn(
        'text relative',
        hasTornEdges && 'torn-edge torn-edge-top torn-edge-bottom mb-4',
        backgroundClass
      )}
    >
      <div className="overflow-hidden">
        <CornerImage position={blok.corner_image_position} />
      </div>
      <div className="spacing container relative z-[2]">
        <motion.div
          className={cn(
            'flex flex-col justify-center',
            alignment === 'center' && 'items-center text-center',
            alignment === 'right' && 'items-end text-right',
            alignment === 'left' && 'items-start',
            headingColorClass,
            bodyColorClass
          )}
          initial={{ opacity: 0, y: -24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {blok.topline && (
            <p className={cn('mb-2 text-body-md font-medium', bodyColorClass)}>{blok.topline}</p>
          )}
          {blok.headline && (
            <h2 className={cn('mb-6 text-h2 font-semibold', headingColorClass)}>{blok.headline}</h2>
          )}
          {blok.richtext && (
            <div className={cn('prose prose-lg dark:prose-invert max-w-none', bodyColorClass)}>
              {renderRichText(blok.richtext)}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
