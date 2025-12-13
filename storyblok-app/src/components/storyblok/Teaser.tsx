import { storyblokEditable } from '@storyblok/react/rsc';
import * as motion from 'motion/react-client';
import { cn, getBackgroundClass, getHeadingColorClass, getBodyColorClass } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface TeaserProps {
  blok: StoryblokBlok & {
    headline: string;
    background_color?: string | { slug?: string };
    torn_paper_edges?: boolean;
  };
}

export default function Teaser({ blok }: TeaserProps) {
  const backgroundClass = getBackgroundClass(blok.background_color);
  const headingColorClass = getHeadingColorClass(blok.background_color);
  const bodyColorClass = getBodyColorClass(blok.background_color);
  const hasTornEdges = blok.torn_paper_edges === true;

  return (
    <section
      {...storyblokEditable(blok)}
      className={cn(
        'teaser relative',
        hasTornEdges && 'torn-edge torn-edge-top torn-edge-bottom mb-4',
        backgroundClass
      )}
    >
      <div className="spacing container">
        <motion.div
          className={cn(
            'flex flex-col items-center justify-center text-center',
            headingColorClass,
            bodyColorClass
          )}
          initial={{ opacity: 0, y: -24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {blok.headline && <h2 className="h2">{blok.headline}</h2>}
        </motion.div>
      </div>
    </section>
  );
}
