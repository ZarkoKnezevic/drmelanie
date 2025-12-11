import { storyblokEditable } from '@storyblok/react/rsc';
import Link from 'next/link';
import Image from 'next/image';
import { prepareImageProps } from '@/lib/adapters/prepareImageProps';
import { prepareLinkProps } from '@/lib/adapters/prepareLinkProps';
import { cn, getBackgroundClass, getTextColorClass } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface FooterProps {
  blok: StoryblokBlok & {
    name?: string;
    practice?: string;
    address?: string;
    postal_code?: number | string;
    city?: string;
    email?: string | { linktype?: 'story' | 'url' | 'email'; url?: string; cached_url?: string };
    phone?: string;
    navigation?: string[]; // Multi-option field with page paths/slugs
    map_image?: {
      filename?: string;
      alt?: string;
      asset?: {
        filename?: string;
        alt?: string;
      };
    };
    map_link?: string | { linktype?: 'story' | 'url' | 'email'; url?: string; cached_url?: string };
  };
}

export default function Footer({ blok }: FooterProps) {
  const backgroundClass = getBackgroundClass(blok.background);
  const textColorClass = getTextColorClass(blok.background);
  const mapImageProps = blok.map_image ? prepareImageProps(blok.map_image) : null;

  // Get email link and display text
  let emailHref = '';
  let emailDisplay = '';
  if (blok.email) {
    if (typeof blok.email === 'string') {
      emailDisplay = blok.email.replace('mailto:', '');
      emailHref = `mailto:${emailDisplay}`;
    } else {
      // Extract email from link object
      let emailAddress = '';

      if (blok.email.linktype === 'email' && blok.email.url) {
        emailAddress = blok.email.url;
      } else if (blok.email.url) {
        emailAddress = blok.email.url.replace('mailto:', '');
      } else if (blok.email.cached_url) {
        emailAddress = blok.email.cached_url.replace('mailto:', '');
      }

      if (emailAddress) {
        emailDisplay = emailAddress.replace('mailto:', '');
        emailHref = `mailto:${emailDisplay}`;
      }
    }
  }

  // Get map link
  let mapHref = '#';
  if (blok.map_link) {
    if (typeof blok.map_link === 'string') {
      mapHref = blok.map_link;
    } else {
      const linkProps = prepareLinkProps({
        link: blok.map_link,
        text: '',
      });
      mapHref = linkProps.href !== '#' ? linkProps.href : '#';
    }
  }

  return (
    <footer {...storyblokEditable(blok)} className={cn(backgroundClass || 'bg-background')}>
      <div className="container flex flex-col gap-8 py-10 md:py-12">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="flex flex-col">
            <h3
              className={cn(
                'mb-5text-center text-body-md font-semibold md:text-left',
                textColorClass
              )}
            >
              Kontaktieren Sie mich
            </h3>
            {blok.name && <p className="text-body-sm text-darkGray">{blok.name}</p>}
            {blok.practice && <p className="text-body-sm text-darkGray">{blok.practice}</p>}
            {(blok.address || blok.postal_code) && (
              <p className="text-body-sm text-darkGray">{blok.address}</p>
            )}
            {(blok.city || blok.postal_code) && (
              <p className="text-body-sm text-darkGray">
                {blok.postal_code}
                {blok.postal_code && blok.city && ' '}
                {blok.city}
              </p>
            )}
            {blok.email && emailDisplay && (
              <a href={emailHref} className="mt-5 text-body-sm text-darkGray hover:underline">
                {emailDisplay}
              </a>
            )}
            {blok.phone && <p className="text-body-sm text-darkGray">{blok.phone}</p>}
          </div>

          {/* Navigation */}
          {blok.navigation && blok.navigation.length > 0 && (
            <div className="flex flex-col">
              <h3
                className={cn(
                  'mb-5 text-center text-body-md font-semibold md:text-left',
                  textColorClass
                )}
              >
                Schnellzugriff
              </h3>
              <ul className="flex flex-col gap-2">
                {/* Add "Startseite" as first item */}
                <li>
                  <Link href="/" className="text-body-md text-darkGray hover:underline">
                    Startseite
                  </Link>
                </li>
                {blok.navigation.map((slug, index) => {
                  // Map field names to display labels
                  const fieldNameToLabel: Record<string, string> = {
                    uber_uns: 'Über uns',
                    uber_mich: 'Über mich',
                    ursprung_des_lebens: 'Ursprung des Lebens',
                    services: 'Services',
                    service: 'Services',
                    ordination: 'Ordination',
                    kontakt: 'Kontakt',
                    contact: 'Kontakt',
                  };

                  // Check if slug matches a known field name
                  const normalizedSlug = slug
                    .toLowerCase()
                    .replace(/^\/|\/$/g, '')
                    .replace(/\//g, '_');
                  const displayLabel =
                    fieldNameToLabel[normalizedSlug] ||
                    fieldNameToLabel[slug.toLowerCase()] ||
                    slug.split('/').pop() ||
                    slug;

                  // Ensure slug starts with /
                  const href = slug.startsWith('/') ? slug : `/${slug}`;

                  return (
                    <li key={index}>
                      <Link href={href} className="text-body-md text-darkGray hover:underline">
                        {displayLabel}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Map */}
          {mapImageProps?.src && (
            <div className="flex flex-col gap-4">
              <h3
                className={cn(
                  'mb-5 text-center text-body-md font-semibold md:text-left',
                  textColorClass
                )}
              >
                Hier finden Sie uns
              </h3>
              {mapHref !== '#' ? (
                <Link
                  href={mapHref}
                  className="relative h-48 w-full overflow-hidden md:h-64 xl:h-96"
                >
                  <Image
                    src={mapImageProps.src}
                    alt={mapImageProps.alt || 'Map'}
                    fill
                    className="object-contain object-center md:object-left"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </Link>
              ) : (
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={mapImageProps.src}
                    alt={mapImageProps.alt || 'Map'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Copyright */}
        {blok.name && (
          <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
            <p
              className={cn(
                'text-center text-sm text-muted-foreground md:text-left',
                textColorClass
              )}
            >
              ©{new Date().getFullYear()} {blok.name}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}
