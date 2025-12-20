import { storyblokEditable } from '@storyblok/react/rsc';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/components/button';
import { prepareImageProps } from '@/lib/adapters/prepareImageProps';
import { prepareLinkProps } from '@/lib/adapters/prepareLinkProps';
import { logger } from '@/utils';
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
    logo_link?:
      | string
      | { linktype?: 'story' | 'url' | 'email'; id?: string; url?: string; cached_url?: string };
    blob?: {
      filename?: string;
      alt?: string;
      asset?: {
        filename?: string;
        alt?: string;
      };
    };
    button?: StoryblokBlok | StoryblokBlok[];
    button_text?: string;
    button_link?:
      | string
      | { linktype?: 'story' | 'url' | 'email'; id?: string; url?: string; cached_url?: string };
    button_variant?: string;
  };
}

export default function Header({ blok }: HeaderProps) {
  // Debug: Log blok data in development
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Header blok:', JSON.stringify(blok, null, 2));
  }

  // Handle button - can be a nested component or direct fields
  const buttonBlok = Array.isArray(blok.button) ? blok.button[0] : blok.button;
  const buttonText = buttonBlok?.text || blok.button_text || 'Button';
  const buttonVariant = (buttonBlok?.variant ||
    buttonBlok?.variants ||
    blok.button_variant ||
    'secondary') as 'primary' | 'secondary' | 'tertiary' | 'quaternary';

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

  // Prepare image props
  const logoProps = blok.logo ? prepareImageProps(blok.logo) : null;
  const blobProps = blok.blob ? prepareImageProps(blok.blob) : null;

  return (
    <header {...storyblokEditable(blok)} className="absolute top-0 z-50 w-full bg-transparent">
      <div className="container flex justify-between ">
        {/* Logo with Blob on the left */}
        <Link href={logoHref} className="flex items-center pt-16 lg:pt-8">
          {logoProps?.src && (
            <div className="relative h-40 w-40">
              {/* Background blob image */}
              {blobProps?.src && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${blobProps.src})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right top',
                  }}
                />
              )}
              {/* Logo */}
              <div className="absolute inset-0">
                <Image
                  src={logoProps.src}
                  alt={logoProps.alt || 'Logo'}
                  fill
                  className="relative z-10 object-contain"
                  priority
                  quality={90}
                />
              </div>
            </div>
          )}
        </Link>

        {/* Button on the right */}
        {(buttonBlok || blok.button_text) && (
          <div className="flex h-16 items-center justify-start lg:h-24 xl:h-32">
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
