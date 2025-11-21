import { renderRichText } from '@/lib/renderRichText';
import type { ISbRichtext } from '@storyblok/react/rsc';

export interface RichTextProps {
  richText: React.ReactNode | null;
  removeInnerMargins?: boolean;
  alignVariant?: 'left' | 'center' | 'right';
}

interface RichTextStoryblok {
  content?: ISbRichtext;
  removeInnerMargins?: boolean;
  alignVariant?: 'left' | 'center' | 'right';
}

export const prepareRichTextProps = (
  props?: RichTextStoryblok
): RichTextProps => {
  if (!props || !props.content) {
    return {
      richText: null,
      removeInnerMargins: false,
      alignVariant: 'left',
    };
  }

  return {
    richText: renderRichText(props.content),
    removeInnerMargins: props.removeInnerMargins || false,
    alignVariant: props.alignVariant || 'left',
  };
};

