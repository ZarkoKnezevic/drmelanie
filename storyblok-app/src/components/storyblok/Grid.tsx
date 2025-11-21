import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc';
import { logger } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface GridProps {
  blok: StoryblokBlok & {
    columns?: number | StoryblokBlok[];
    gap?: string;
    items?: StoryblokBlok[];
    columns_content?: StoryblokBlok[];
    content?: StoryblokBlok[];
  };
}

export default function Grid({ blok }: GridProps) {
  // Check if columns is a number (for grid layout) or an array (for nested items)
  const columnsCount = typeof blok.columns === 'number' ? blok.columns : 3;
  const gap = blok.gap || '6';

  // Try multiple field names for nested items
  // Storyblok might use: items, columns (as array), columns_content, content
  const items = Array.isArray(blok.columns)
    ? blok.columns
    : (blok.items || blok.columns_content || blok.content || []);

  // Debug: Log Grid component data
  if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
    logger.debug('Grid component data:');
    logger.debug('  Columns count:', columnsCount);
    logger.debug('  Gap:', gap);
    logger.debug('  All blok keys:', Object.keys(blok));
    logger.debug('  blok.columns type:', typeof blok.columns, 'isArray?', Array.isArray(blok.columns));
    logger.debug('  Final items array length:', items.length);
    if (items.length > 0) {
      items.forEach((item: StoryblokBlok, index: number) => {
        logger.debug(`  Item [${index}]: component="${item.component}", _uid="${item._uid}"`);
      });
    }
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columnsCount] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  const gapClass = {
    '0': 'gap-0',
    '1': 'gap-1',
    '2': 'gap-2',
    '3': 'gap-3',
    '4': 'gap-4',
    '5': 'gap-5',
    '6': 'gap-6',
    '8': 'gap-8',
    '10': 'gap-10',
    '12': 'gap-12',
  }[gap] || 'gap-6';

  // If no items, show a placeholder or empty state
  if (!items || items.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div
          {...storyblokEditable(blok)}
          className={`grid ${gridCols} ${gapClass} container mx-auto px-6 py-12 border-2 border-dashed border-gray-300`}
        >
          <div className="col-span-full text-center text-gray-500 py-8">
            ⚠️ Grid component has no items to display. Add items in Storyblok.
            <br />
            <span className="text-xs">Checked: items, columns, columns_content, content</span>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div
      {...storyblokEditable(blok)}
      className={`grid ${gridCols} ${gapClass} container mx-auto px-6 py-12`}
    >
      {items.map((nestedBlok: StoryblokBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}

