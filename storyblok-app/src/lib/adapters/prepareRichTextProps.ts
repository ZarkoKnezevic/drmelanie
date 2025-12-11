import renderRichText from '@/lib/renderRichText';

export interface RichTextProps {
  richText: React.ReactNode | null;
  removeInnerMargins?: boolean;
  alignVariant?: 'left' | 'center' | 'right';
}

interface RichTextStoryblok {
  content?: any; // ISbRichtext - richtext content from Storyblok
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

