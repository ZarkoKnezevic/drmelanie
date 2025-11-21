import { StoryblokServerComponent } from '@storyblok/react/rsc';
import type { ISbRichtext, SbBlokData } from '@storyblok/react/rsc';
import { render } from 'storyblok-rich-text-react-renderer';
import { prepareImageProps } from './adapters/prepareImageProps';
import Image from 'next/image';
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
    },
  });
}

