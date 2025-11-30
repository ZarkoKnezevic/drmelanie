import { StoryblokServerComponent } from '@storyblok/react/rsc';
import type { ISbRichtext, SbBlokData } from '@storyblok/react/rsc';
import { render } from 'storyblok-rich-text-react-renderer';
import { prepareImageProps } from './adapters/prepareImageProps';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/components/button';
import type { StoryblokBlok } from '@/types';

interface RichTextImageProps {
  asset?: { filename?: string; alt?: string };
  filename?: string;
  alt?: string;
  aspectRatio?: string;
}

export default function renderRichText(data: ISbRichtext) {
  return render(data, {
    markResolvers: {},
    nodeResolvers: {},
    blokResolvers: {
      image: (props: RichTextImageProps) => {
        const imageProps = prepareImageProps({
          filename: props.asset?.filename || props.filename,
          alt: props.asset?.alt || props.alt,
        });

        return (
          <div
            className="relative mx-auto"
            style={{
              aspectRatio: props.aspectRatio || '16/9',
            }}
          >
            <Image {...imageProps} className="object-cover" />
          </div>
        );
      },
      cardsGrid: (props: SbBlokData) => {
        return (
          <StoryblokServerComponent
            blok={{
              ...props,
              component: 'cardsGrid',
            } as StoryblokBlok}
          />
        );
      },
      linksList: (props: SbBlokData) => {
        return (
          <StoryblokServerComponent
            blok={{
              ...props,
              component: 'linksList',
            } as StoryblokBlok}
          />
        );
      },
      logos: (props: SbBlokData) => {
        return (
          <StoryblokServerComponent
            blok={{
              ...props,
              component: 'logos',
            } as StoryblokBlok}
          />
        );
      },
      carousel: (props: SbBlokData) => {
        return (
          <StoryblokServerComponent
            blok={{
              ...props,
              component: 'carousel',
            } as StoryblokBlok}
          />
        );
      },
      button: (props: Record<string, unknown>) => {
        // Type-safe extraction of props
        const text = (props.text as string) || 'Button';
        const variants = props.variants as string | undefined;
        const variant = (variants || props.variant || 'default') as 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
        const size = (props.size || 'default') as 'default' | 'sm' | 'lg' | 'icon';
        const disabled = props.disabled as boolean | undefined;
        const buttonType = (props.type || 'button') as 'button' | 'submit' | 'reset';
        
        // Handle link - can be a string (Text field) or Link object
        const linkProp = props.link;
        const linkUrl = typeof linkProp === 'string' 
          ? linkProp 
          : linkProp && typeof linkProp === 'object'
          ? ((linkProp as { cached_url?: string; url?: string }).cached_url || (linkProp as { cached_url?: string; url?: string }).url)
          : undefined;
        
        if (linkUrl) {
          return (
            <Button
              asChild
              variant={variant}
              size={size}
            >
              <Link href={linkUrl}>{text}</Link>
            </Button>
          );
        }
        
        return (
          <Button
            variant={variant}
            size={size}
            disabled={disabled}
            type={buttonType}
          >
            {text}
          </Button>
        );
      },
    },
  });
}

