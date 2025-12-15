import { storyblokEditable } from '@storyblok/react/rsc';
import Link from 'next/link';
import { Button } from '@/components/ui/components/button';
import { BannerAnimated } from './banner-animated';
import { cn, getBackgroundClass, getHeadingColorClass, getBodyColorClass } from '@/utils';
import { prepareLinkProps } from '@/lib/adapters/prepareLinkProps';
import type { StoryblokBlok } from '@/types';

interface BannerProps {
  blok: StoryblokBlok & {
    topline?: string;
    headline: string;
    button?: StoryblokBlok | StoryblokBlok[];
    background_color?: string | { slug?: string };
    torn_paper_edges?: boolean;
  };
}

export default function Banner({ blok }: BannerProps) {
  const backgroundClass = getBackgroundClass(blok.background_color);
  const headingColorClass = getHeadingColorClass(blok.background_color);
  const bodyColorClass = getBodyColorClass(blok.background_color);
  const hasTornEdges = blok.torn_paper_edges;
  const buttonBlok = Array.isArray(blok.button) ? blok.button[0] : blok.button;
  const buttonText = buttonBlok?.text || 'Button';
  const buttonVariant = (buttonBlok?.variant || buttonBlok?.variants || 'primary') as
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'quaternary'
    | 'quinary'
    | 'senary'
    | 'septenary';

  let buttonHref: string | null = null;
  if (buttonBlok?.link) {
    if (typeof buttonBlok.link === 'string') {
      buttonHref = buttonBlok.link;
    } else {
      const linkProps = prepareLinkProps({
        link: buttonBlok.link,
        text: buttonText,
        variant: buttonVariant,
      });
      buttonHref = linkProps.href !== '#' ? linkProps.href : null;
    }
  }

  return (
    <section
      {...storyblokEditable(blok)}
      className={cn(
        'banner relative',
        hasTornEdges && 'torn-edge torn-edge-top torn-edge-bottom mb-4',
        backgroundClass || 'bg-background'
      )}
    >
      <div
        className={cn(
          'relative z-10 flex flex-1 flex-col items-center justify-center pb-12 pt-8 md:pb-0 md:pt-0',
          backgroundClass || 'bg-background'
        )}
      >
        <div className="container md:py-12 lg:py-20">
          <div className="flex w-full flex-col gap-8 md:flex-row md:justify-between">
            {/* Topline and Headline */}
            <div className="flex flex-col">
              {blok.topline && (
                <BannerAnimated delay={100} animationType="fade-up">
                  <p className={cn('text-body', bodyColorClass)}>{blok.topline}</p>
                </BannerAnimated>
              )}

              <BannerAnimated delay={250} animationType="fade-up">
                <h2 className={cn('h2', headingColorClass)}>{blok.headline}</h2>
              </BannerAnimated>
            </div>

            {/* Button */}
            {buttonBlok && (
              <BannerAnimated delay={400} animationType="fade-down">
                {buttonHref ? (
                  <Button asChild variant={buttonVariant}>
                    <Link href={buttonHref}>{buttonText}</Link>
                  </Button>
                ) : (
                  <Button variant={buttonVariant}>{buttonText}</Button>
                )}
              </BannerAnimated>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
