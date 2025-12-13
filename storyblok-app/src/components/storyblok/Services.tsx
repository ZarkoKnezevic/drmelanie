import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc';
import Link from 'next/link';
import * as motion from 'motion/react-client';
import { Button } from '@/components/ui/components/button';
import { prepareLinkProps } from '@/lib/adapters/prepareLinkProps';
import { cn, getBackgroundClass } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface ServicesProps {
  blok: StoryblokBlok & {
    services?: StoryblokBlok[];
    items?: StoryblokBlok[];
    columns?: StoryblokBlok[];
    columns_content?: StoryblokBlok[];
    content?: StoryblokBlok[];
    button?: StoryblokBlok | StoryblokBlok[];
    background_color?: string | { slug?: string };
  };
}

export default function Services({ blok }: ServicesProps) {
  const backgroundClass = getBackgroundClass(blok.background_color);

  // Get services from various possible field names
  const services =
    blok.services ||
    blok.items ||
    (Array.isArray(blok.columns) ? blok.columns : []) ||
    blok.columns_content ||
    blok.content ||
    [];

  // Handle button
  const buttonBlok = Array.isArray(blok.button) ? blok.button[0] : blok.button;
  const buttonText = buttonBlok?.text || 'Button';
  const buttonVariant = (buttonBlok?.variant || buttonBlok?.variants || 'primary') as
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'quaternary';

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

  if (!services || services.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <section
          {...storyblokEditable(blok)}
          className={cn('services-section', backgroundClass)}
        >
          <div className="container mx-auto px-6 py-12">
            <div className="text-center text-gray-500">
              ⚠️ Services component has no items to display. Add services in Storyblok.
            </div>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section
      {...storyblokEditable(blok)}
      className={cn('services-section', backgroundClass)}
    >
      <div className="spacing container">
        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service: StoryblokBlok, index: number) => (
            <motion.div
              key={service._uid}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
            >
              <StoryblokServerComponent blok={service} />
            </motion.div>
          ))}
        </div>

        {/* Button */}
        {buttonBlok && (
          <div className="mt-12 flex justify-center">
            {buttonHref ? (
              <Button asChild variant={buttonVariant}>
                <Link href={buttonHref}>{buttonText}</Link>
              </Button>
            ) : (
              <Button variant={buttonVariant}>{buttonText}</Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

