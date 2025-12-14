import { StoryblokServerComponent } from '@storyblok/react/rsc';
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

export default function renderRichText(data: any) {
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
      cardsGrid: (props: Record<string, unknown>) => {
        return (
          <StoryblokServerComponent
            blok={{
              ...props,
              component: 'cardsGrid',
            } as StoryblokBlok}
          />
        );
      },
      linksList: (props: Record<string, unknown>) => {
        return (
          <StoryblokServerComponent
            blok={{
              ...props,
              component: 'linksList',
            } as StoryblokBlok}
          />
        );
      },
      logos: (props: Record<string, unknown>) => {
        return (
          <StoryblokServerComponent
            blok={{
              ...props,
              component: 'logos',
            } as StoryblokBlok}
          />
        );
      },
      carousel: (props: Record<string, unknown>) => {
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
        const rawVariant = (variants || props.variant || 'primary') as string;
        // Map unsupported variants to supported ones
        const variantMap: Record<string, 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary'> = {
          default: 'primary',
          destructive: 'secondary',
          outline: 'secondary',
          ghost: 'secondary',
          link: 'primary',
          primary: 'primary',
          secondary: 'secondary',
          tertiary: 'tertiary',
          quaternary: 'quaternary',
          quinary: 'quinary',
        };
        const variant = variantMap[rawVariant] || 'primary';
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
            >
              <Link href={linkUrl}>{text}</Link>
            </Button>
          );
        }
        
        return (
          <Button
            variant={variant}
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

