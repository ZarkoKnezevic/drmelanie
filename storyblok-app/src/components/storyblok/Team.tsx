import { storyblokEditable } from '@storyblok/react/rsc';
import { StoryblokServerComponent } from '@storyblok/react/rsc';
import { cn, getBackgroundClass } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface TeamProps {
  blok: StoryblokBlok & {
    background_color?: string | { slug?: string };
    torn_paper_edges?: boolean;
    members?: StoryblokBlok[];
  };
}

export default function Team({ blok }: TeamProps) {
  const backgroundClass = getBackgroundClass(blok.background_color);
  const hasTornEdges = blok.torn_paper_edges === true;
  const members = blok.members || [];

  return (
    <section
      {...storyblokEditable(blok)}
      className={cn(
        'team relative',
        hasTornEdges && 'torn-edge torn-edge-top torn-edge-bottom mb-4',
        backgroundClass
      )}
    >
      <div className="spacing container">
        <div className="flex flex-col gap-12">
          {members.map((memberBlok) => (
            <StoryblokServerComponent key={memberBlok._uid} blok={memberBlok} />
          ))}
        </div>
      </div>
    </section>
  );
}
