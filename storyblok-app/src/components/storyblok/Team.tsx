import { storyblokEditable } from '@storyblok/react/rsc';
import { StoryblokServerComponent } from '@storyblok/react/rsc';
import { cn, getBackgroundClass } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface TeamProps {
  blok: StoryblokBlok & {
    background_color?: string | { slug?: string };
    members?: StoryblokBlok[];
  };
}

export default function Team({ blok }: TeamProps) {
  const backgroundClass = getBackgroundClass(blok.background_color);
  const members = blok.members || [];

  return (
    <section {...storyblokEditable(blok)} className={cn('team relative z-10', backgroundClass)}>
      <div className="flex flex-col">
        {members.map((memberBlok, index) => {
          const isFirst = index === 0;
          const isLast = index === members.length - 1;
          return (
            <StoryblokServerComponent
              key={memberBlok._uid}
              blok={{ ...memberBlok, isFirst, isLast } as StoryblokBlok}
            />
          );
        })}
      </div>
    </section>
  );
}
