import { storyblokEditable } from '@storyblok/react/rsc';
import Link from 'next/link';
import * as motion from 'motion/react-client';
import { Button } from '@/components/ui/components/button';
import { cn, getBackgroundClass, getTextColorClass } from '@/utils';
import { prepareLinkProps } from '@/lib/adapters/prepareLinkProps';
import type { StoryblokBlok } from '@/types';

interface BannerProps {
  blok: StoryblokBlok & {
    topline?: string;
    headline: string;
    button?: StoryblokBlok | StoryblokBlok[];
    background?: string;
    torn_paper_edges?: boolean;
  };
}

export default function Banner({ blok }: BannerProps) {
  const backgroundClass = getBackgroundClass(blok.background);
  const textColorClass = getTextColorClass(blok.background);
  const hasTornEdges = blok.torn_paper_edges;
  const buttonBlok = Array.isArray(blok.button) ? blok.button[0] : blok.button;
  const buttonText = buttonBlok?.text || 'Button';
  const buttonVariant = (buttonBlok?.variant || buttonBlok?.variants || 'primary') as 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  
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
      <div className={cn(
        'relative z-10 flex flex-1 flex-col items-center justify-center pt-8 pb-12 md:pt-0 md:pb-0',
        backgroundClass || 'bg-background'
      )}>
        <div className="container md:py-12 lg:py-20">
          <div className="flex flex-col md:flex-row gap-8 w-full md:justify-between">
            {/* Topline and Headline */}
            <div className="flex flex-col">
              {blok.topline && (
                <motion.p
                  className={cn('text-body font-bold', textColorClass)}
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                >
                  {blok.topline}
                </motion.p>
              )}

              <motion.h1
                className={cn('h1', textColorClass)}
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
              >
                {blok.headline}
              </motion.h1>
            </div>

            {/* Button */}
            {buttonBlok && (
              <motion.div
                className="flex items-start"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
              >
                {buttonHref ? (
                  <Button asChild variant={buttonVariant}>
                    <Link href={buttonHref}>
                      {buttonText}
                    </Link>
                  </Button>
                ) : (
                  <Button variant={buttonVariant}>
                    {buttonText}
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

