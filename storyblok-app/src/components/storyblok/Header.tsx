import { storyblokEditable } from '@storyblok/react/rsc';
import Link from 'next/link';
import { Button } from '@/components/ui/components/button';
import { prepareLinkProps } from '@/lib/adapters/prepareLinkProps';
import type { StoryblokBlok } from '@/types';

interface HeaderProps {
  blok: StoryblokBlok & {
    logo?: {
      filename?: string;
      alt?: string;
      asset?: {
        filename?: string;
        alt?: string;
      };
    };
    logo_link?: string | { linktype?: string; url?: string; cached_url?: string };
    button?: StoryblokBlok | StoryblokBlok[];
    button_text?: string;
    button_link?: string | { linktype?: string; url?: string; cached_url?: string };
    button_variant?: string;
  };
}

export default function Header({ blok }: HeaderProps) {
  // Handle button - can be a nested component or direct fields
  const buttonBlok = Array.isArray(blok.button) ? blok.button[0] : blok.button;
  const buttonText = buttonBlok?.text || blok.button_text || 'Button';
  const buttonVariant = (buttonBlok?.variant || buttonBlok?.variants || blok.button_variant || 'secondary') as
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'quaternary';

  // Get button link
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
  } else if (blok.button_link) {
    if (typeof blok.button_link === 'string') {
      buttonHref = blok.button_link;
    } else {
      const linkProps = prepareLinkProps({
        link: blok.button_link,
        text: buttonText,
        variant: buttonVariant,
      });
      buttonHref = linkProps.href !== '#' ? linkProps.href : null;
    }
  }

  // Get logo link
  let logoHref = '/';
  if (blok.logo_link) {
    if (typeof blok.logo_link === 'string') {
      logoHref = blok.logo_link;
    } else {
      const linkProps = prepareLinkProps({
        link: blok.logo_link,
        text: '',
      });
      logoHref = linkProps.href !== '#' ? linkProps.href : '/';
    }
  }

  return (
    <header
      {...storyblokEditable(blok)}
      className="absolute top-0 z-50 w-full bg-transparent"
    >
      <div className="container flex h-16 lg:h-24 xl:h-32 items-center justify-between">
        {/* Logo */}
        {blok.logo?.filename && (
          <Link href={logoHref} className="flex items-center">
            <img
              src={blok.logo.filename}
              alt={blok.logo.alt || 'Logo'}
              className="h-8 lg:h-12 xl:h-16 w-auto"
            />
          </Link>
        )}

        {/* Button */}
        {(buttonBlok || blok.button_text) && (
          <div className="flex items-center">
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
    </header>
  );
}

